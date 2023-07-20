from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
from requests.adapters import HTTPAdapter
from requests.packages.urllib3.util.retry import Retry
from bs4 import BeautifulSoup
import re


URL_PREFIX = "https://codeforces.com"


class Group:
    def __init__(self, group_constructor):
        self.url = group_constructor["url"]
        response = requests.get(self.url)
        soup = BeautifulSoup(response.text, "html.parser")
        self.name = soup.select_one("#sidebar th a").string.strip()
        self.contest_constructors = []
        contest_table = soup.find("div", class_="contests-table")
        if contest_table:
            table_rows = contest_table.find_all("tr")
            for table_row in table_rows[1:]:
                table_cells = table_row.find_all("td")
                contest_url = table_cells[0].find(
                    "a", string=lambda string: string and "Enter »" in string
                )["href"]
                if not contest_url.startswith(URL_PREFIX):
                    contest_url = URL_PREFIX + contest_url
                contest_start_time = table_cells[1].find("span", class_="format-time")
                if contest_start_time is not None:
                    contest_start_time = contest_start_time.string.strip()
                else:
                    contest_start_time = "-"
                self.contest_constructors.append(
                    {"url": contest_url, "start_time": contest_start_time}
                )
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
        self.div = "All"
        self.number = 0
        self.problems = []
        response = requests.get(self.url)
        soup = BeautifulSoup(response.text, "html.parser")
        self.name = soup.find("li", class_="active").find("a").string.strip()
        if match := re.search(r"\[.*?\]", self.name):
            self.div = match.group(0)[1:-1]
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
            "div": self.div,
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
