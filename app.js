const express = require("express");
const path = require("path");

const { open } = require("sqlite");
const sqlite3 = require("sqlite3");

const app = express();
app.use(express.json());
const dbPath = path.join(__dirname, "cricketTeam.db");

let db = null;

const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("Server Running at http://localhost:3000/");
    });
  } catch (e) {
    console.log(`DB Error: ${e.message}`);
    process.exit(1);
  }
};
initializeDBAndServer();

// get players

app.get("/players/", async (request, response) => {
  const getQueryDetails = `
    SELECT * FROM cricket_team
    `;
  const Data = await db.all(getQueryDetails);
  response.send(Data);
});

// add a player in the table

app.post("/players/", async (request, response) => {
  const playerDetails = request.body;
  const { playerName, jerseyNumber, role } = playerDetails;

  const addPlayerQuery = `
    INSERT INTO cricket_team(player_name, jersey_number, role)
    VALUES(
        '${playerName}',
         ${jerseyNumber},
        '${role}'
    )
    `;
  const data = await db.run(addPlayerQuery);
  const bookId = data.lastID;
  response.send("Player Added to Team");
});

// get player details

app.get("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  const getPlayerDataQuery = `
    SELECT * FROM cricket_team
    WHERE player_id = ${playerId};
    `;
  const responseData = await db.get(getPlayerDataQuery);
  response.send(responseData);
});

// update player details

app.put("/players/:playerId/", async (request, response) => {
  const playerData = request.body;
  const { playerName, jerseyNumber, role } = playerData;
  const { playerId } = request.params;
  const updatePlayerDataQuery = `
    UPDATE cricket_team SET 
     player_name = '${playerName}',
     jersey_number = ${jerseyNumber},
     role = '${role}'
    WHERE player_id = ${playerId};
    `;
  const responseData = await db.run(updatePlayerDataQuery);
  response.send("Player Details Updated");
});

// delete player

app.delete("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  const deletePlayerQuery = `
    DELETE FROM cricket_team 
    WHERE player_id = ${playerId};
    `;
  const data = await db.run(deletePlayerQuery);
  response.send("Player Removed");
});

module.exports = app;
