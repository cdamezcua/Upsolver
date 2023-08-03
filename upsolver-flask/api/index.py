from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
from requests.adapters import HTTPAdapter
from requests.packages.urllib3.util.retry import Retry
from bs4 import BeautifulSoup
import re


URL_PREFIX = "https://codeforces.com"


retry_strategy = Retry(total=4, status_forcelist=[429, 500, 502, 503, 504])

http: requests.Session = requests.Session()

http.mount("https://", HTTPAdapter(max_retries=retry_strategy))


class Group:
    def __init__(self, group_constructor: dict[str, str]) -> None:
        self.url: str = group_constructor["url"]
        response: requests.Response = http.get(self.url)
        soup: BeautifulSoup = BeautifulSoup(response.text, "html.parser")
        document: str = soup.prettify()
        state: int = 0
        rowIndex: int = 0
        colIndex: int = 0
        divDepth: int = 0
        href: str = ""
        contest_url: str = ""
        contest_start_time: str = ""
        self.contest_constructors: list[dict[str, str]] = []
        for line in document.split("\n"):
            line: str = line.strip()
            if state == 0:  # in document looking for contests-table or sidebar
                if line.startswith("<div") and "contests-table" in line:
                    rowIndex = 0
                    state = 1
                    divDepth = 1
                elif line.startswith("<div") and 'id="sidebar"' in line:
                    state = 6
                    divDepth = 1
            elif state == 1:  # in contests-table looking for every tr
                if line.startswith("<div"):
                    divDepth += 1
                elif line.startswith("</div"):
                    divDepth -= 1
                    if divDepth == 0:
                        state = 0
                elif line.startswith("<tr"):
                    colIndex = 0
                    state = 2
            elif state == 2:  # in contest-table>tr looking for every td
                if line.startswith("</tr>"):
                    rowIndex += 1
                    if contest_url != "":
                        self.contest_constructors.append(
                            {
                                "url": contest_url,
                                "start_time": contest_start_time or "-",
                            }
                        )
                    contest_url = ""
                    contest_start_time = ""
                    state = 1
                elif rowIndex == 0:  # ignore the first row
                    continue
                elif line.startswith("<td"):
                    state = 3
            elif state == 3:  # in contest-table>tr>td looking for info
                if line.startswith("</td>"):
                    colIndex += 1
                    state = 2
                elif 0 <= colIndex and colIndex <= 1:
                    if line.startswith("<a"):
                        href = re.search(r'href="(.+?)"', line).group(1)
                        state = 4
            elif state == 4:  # in contest-table>tr>td>a looking for c. url and span
                if line.startswith("</a>"):
                    state = 3
                elif not line.startswith("<") and line.strip() == "Enter »":
                    contest_url = href
                    if not contest_url.startswith(URL_PREFIX):
                        contest_url = URL_PREFIX + contest_url
                    state = 3
                elif line.startswith("<span"):
                    state = 5
            elif state == 5:  # in contest-table>tr>td>a>span looking for start time
                if line.startswith("</span>"):
                    state = 4
                elif not line.startswith("<"):
                    contest_start_time = line.strip()
            elif state == 6:  # in sidebar looking for th
                if line.startswith("<div"):
                    divDepth += 1
                elif line.startswith("</div"):
                    divDepth -= 1
                    if divDepth == 0:
                        state = 0
                elif line.startswith("<th"):
                    state = 7
            elif state == 7:  # in sidebar>th looking for a
                if line.startswith("</th>"):
                    state = 6
                elif line.startswith("<a"):
                    state = 8
            elif state == 8:  # in sidebar>th>a looking for group name
                if line.startswith("</a>"):
                    state = 7
                elif not line.startswith("<"):
                    self.name: str = line.strip()
        self.json: dict = {
            "url": self.url,
            "name": self.name,
            "contest_constructors": self.contest_constructors,
        }


class Contest:
    def __init__(self, contest_constructor: dict[str, str]) -> None:
        self.url: str = contest_constructor["url"]
        try:
            self.start_time: str = contest_constructor["start_time"]
        except KeyError:
            self.start_time = "-"
        self.name: str = ""
        self.division: str = "All"
        self.number: int = 0
        self.problems: list[Problem] = []
        response: requests.Response = http.get(self.url)
        soup: BeautifulSoup = BeautifulSoup(response.text, "html.parser")
        document: str = soup.prettify()
        state: int = 0
        rowIndex: int = -1
        colIndex: int = 0
        nameAnchorFound: bool = False
        href: str = ""
        problem_url: str = ""
        problem_number: str = ""
        problem_name: str = ""
        problem_solved_count: int = 0
        for line in document.split("\n"):
            line: str = line.strip()
            if (
                state == 0
            ):  # in document looking for contest-name-anchor or problems-table
                if (
                    not nameAnchorFound
                    and line.startswith("<a ")
                    and 'href="' + self.url[len(URL_PREFIX) :] + '"' in line
                ):
                    state = 1
                elif (
                    line.startswith("<table ")
                    and (match := re.search(r'class="(.+?)"', line))
                    and re.search(r"problems", match.group(1))
                ):
                    rowIndex = 0
                    state = 2
            elif state == 1:  # in contest-name-anchor looking for contest name
                if line.startswith("</a>"):
                    nameAnchorFound = True
                    state = 0
                elif not line.startswith("<"):
                    self.name = line.strip()
                    if match := re.search(r"\[.*?\]", self.name):
                        self.division = match.group(0)[1:-1]
                    if match := re.search(r"#\d+", self.name):
                        self.number = int(match.group(0)[1:])
            elif state == 2:  # in problems-table looking for every tr and td
                if line.startswith("</table>"):
                    if problem_url != "":
                        self.problems.append(
                            Problem(
                                problem_url,
                                problem_number,
                                problem_name,
                                problem_solved_count,
                            )
                        )
                    state = 0
                elif line.startswith("<tr ") or line.startswith("<tr>"):
                    rowIndex = rowIndex + 1
                    colIndex = 0
                    if problem_url != "":
                        self.problems.append(
                            Problem(
                                problem_url,
                                problem_number,
                                problem_name,
                                problem_solved_count,
                            )
                        )
                    href = ""
                    problem_url = ""
                    problem_number = 0
                    problem_name = ""
                    problem_solved_count = 0
                elif rowIndex == 0:  # ignore the first row
                    continue
                elif line.startswith("<td"):
                    state = 3
            elif state == 3:  # in problems-table>tr>td looking for info
                if line.startswith("</td>"):
                    colIndex += 1
                    state = 2
                elif colIndex == 0:
                    if line.startswith("<a "):
                        href = re.search(r'href="(.+?)"', line).group(1)
                        state = 4
                elif colIndex == 1:
                    if line.startswith("<a "):
                        state = 5
                elif colIndex == 3:
                    if line.startswith("<a "):
                        state = 6
            elif (
                state == 4
            ):  # in problems-table>tr>td[0]>a looking for problem_url and problem_number
                if line.startswith("</a>"):
                    state = 3
                elif not line.startswith("<"):
                    problem_url = href
                    if not problem_url.startswith(URL_PREFIX):
                        problem_url = URL_PREFIX + problem_url
                    problem_number = line.strip()
            elif state == 5:  # in problems-table>tr>td[1]>a looking for problem_name
                if line.startswith("</a>"):
                    state = 3
                elif (
                    not line.startswith("<")
                    and not line.startswith("<!--")
                    and not line.startswith("-->")
                ):
                    problem_name = line.strip()
            elif (
                state == 6
            ):  # in problems-table>tr>td[3]>a looking for problem_solved_count
                if line.startswith("</a>"):
                    state = 3
                elif not line.startswith("<") and len(line.strip()) > 1:
                    problem_solved_count = int(line.strip()[1:])
        self.json: dict = {
            "url": self.url,
            "name": self.name,
            "start_time": self.start_time,
            "division": self.division,
            "number": self.number,
            "problems": [problem.json for problem in self.problems],
        }


class Problem:
    def __init__(self, url: str, number: str, name: str, solved_count: int) -> None:
        self.url: str = url
        self.number: str = number
        self.name: str = name
        self.solved_count: int = solved_count
        self.json: dict = {
            "url": self.url,
            "number": self.number,
            "name": self.name,
            "solved_count": self.solved_count,
        }


app = Flask(__name__)

CORS(app)


@app.route("/")
def home() -> requests.Response:
    return jsonify(
        {
            "message": "Hello, World!",
        }
    )


@app.route("/groups", methods=["POST"])
def groups() -> requests.Response:
    data: dict = request.get_json()
    group_constructor: dict = data["group_constructor"]
    group: Group = Group(group_constructor)
    return jsonify(
        {
            "group": group.json,
        }
    )


@app.route("/contests", methods=["POST"])
def contests() -> requests.Response:
    data: dict = request.get_json()
    contest_constructor: dict = data["contest_constructor"]
    contest: Contest = Contest(contest_constructor)
    return jsonify(
        {
            "contest": contest.json,
        }
    )


if __name__ == "__main__":
    app.run()
