from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
from requests.adapters import HTTPAdapter
from requests.packages.urllib3.util.retry import Retry
from bs4 import BeautifulSoup
import re


URL_PREFIX = "https://codeforces.com"


retry_strategy = Retry(total=4, status_forcelist=[429, 500, 502, 503, 504])

http = requests.Session()

http.mount("https://", HTTPAdapter(max_retries=retry_strategy))


class Group:
    def __init__(self, group_constructor):
        self.url = group_constructor["url"]
        response = http.get(self.url)
        soup = BeautifulSoup(response.text, "html.parser")
        document = soup.prettify()
        state = 0
        rowIndex = 0
        colIndex = 0
        divDepth = 0
        href = ""
        contest_url = ""
        contest_start_time = ""
        self.contest_constructors = []
        for line in document.split("\n"):
            line = line.strip()
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
                    self.name = line.strip()
        self.json = {
            "url": self.url,
            "name": self.name,
            "contest_constructors": self.contest_constructors,
        }


class Contest:
    def __init__(self, contest_constructor):
        self.url = contest_constructor["url"]
        try:
            self.start_time = contest_constructor["start_time"]
        except KeyError:
            self.start_time = "-"
        self.name = ""
        self.division = "All"
        self.number = 0
        self.problems = []
        response = http.get(self.url)
        soup = BeautifulSoup(response.text, "html.parser")
        if name_anchor := soup.find("a", href=self.url[len(URL_PREFIX) :]):
            self.name = name_anchor.string.strip()
        if match := re.search(r"\[.*?\]", self.name):
            self.division = match.group(0)[1:-1]
        if match := re.search(r"#\d+", self.name):
            self.number = int(match.group(0)[1:])
        problem_table = soup.find("table", class_="problems")
        if problem_table:
            table_rows = problem_table.find_all("tr")
            for table_row in table_rows[1:]:
                table_cells = table_row.find_all("td")
                problem_url = table_cells[0].find("a")["href"]
                if not problem_url.startswith(URL_PREFIX):
                    problem_url = URL_PREFIX + problem_url
                problem_number = table_cells[0].find("a").string.strip()
                problem_name = table_cells[1].find("a").contents[1].strip()
                problem_solved_count = 0
                if len(table_cells) > 3:
                    anchor = table_cells[3].find("a")
                    if anchor and len(anchor.contents) > 1:
                        problem_solved_count = int(
                            anchor.contents[1].string.strip()[1:]
                        )
                self.problems.append(
                    Problem(
                        problem_url, problem_number, problem_name, problem_solved_count
                    )
                )
        self.json = {
            "url": self.url,
            "name": self.name,
            "start_time": self.start_time,
            "division": self.division,
            "number": self.number,
            "problems": [problem.json for problem in self.problems],
        }


class Problem:
    def __init__(self, url, number, name, solved_count):
        self.url = url
        self.number = number
        self.name = name
        self.solved_count = solved_count
        self.json = {
            "url": self.url,
            "number": self.number,
            "name": self.name,
            "solved_count": self.solved_count,
        }


app = Flask(__name__)

CORS(app)


@app.route("/")
def home():
    return "Hello, World!"


@app.route("/groups", methods=["POST"])
def groups():
    data = request.get_json()
    group_constructor = data["group_constructor"]
    group = Group(group_constructor)
    return jsonify(
        {
            "group": group.json,
        }
    )


@app.route("/contests", methods=["POST"])
def contests():
    data = request.get_json()
    contest_constructor = data["contest_constructor"]
    contest = Contest(contest_constructor)
    return jsonify(
        {
            "contest": contest.json,
        }
    )


if __name__ == "__main__":
    app.run()
