import { sequelize } from "../database.js";
import { FLASK_API_URL } from "../constants/urls.js";
import AppError from "../utils/AppError.js";
import { Contest } from "../models/index.js";

const createContestAutomatically = async (
  groupId,
  contest_constructor
) => {
  try {
    const response = await fetch(FLASK_API_URL + "contests", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ contest_constructor }),
    });
    const data = await response.json();

    const contest = data.contest;

    const createContest = `
            INSERT INTO contests
                (groupId, url, name, start_time, division, number)
            VALUES
                (${groupId}, '${contest.url}', '${contest.name}', '${contest.start_time}', '${contest.division}', '${contest.number}');`;
    const [createdContest, created] = await sequelize.query(createContest, {
      type: sequelize.QueryTypes.INSERT,
      model: Contest,
      mapToModel: true,
    });

    if (!created) {
      throw new AppError(500, "Failed to create contest");
    }

    return createdContest;
  } catch (err) {
    return err;
  }
};

export default createContestAutomatically;
