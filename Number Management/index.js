import express from "express";
import dotenv from "dotenv";
import axios from "axios";

const app = express();
dotenv.config();
const PORT = process.env.SERVER_PORT;

app.use(express.json());

app.get("/", (req, res) => {
  res.send("server is running fine!");
});

app.get("/numbers", async (req, res) => {
  const urls = req.query.url;

  //   We have to take all the urls that are given query parameter
  if (!urls) {
    return res.status(400).json({ error: "There is no URLs" });
  }

  const urlsArray = Array.isArray(urls) ? urls : [urls];
  console.log(urlsArray);

  const urlsData = urlsArray.map(async (url) => {
    try {
      const response = await axios.get(url, { timeout: 500 });
      const numbers = response.data.numbers;
      //   console.log(numbers)
      return numbers;
    } catch (error) {
      console.log(`Error fetching data from ${url} : ${error.message}`);
      return [];
    }
  });

  try {
    const results = await Promise.all(urlsData);
    const mergedNumbers = results.reduce(
      (merged, numbers) => [...merged, ...numbers],
      []
    );
    const finalResults = Array.from(new Set(mergedNumbers)).sort(
      (a, b) => a - b
    );

    res.json({ numbers: finalResults });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error!" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is listening on http://localhost:${PORT}`);
});
