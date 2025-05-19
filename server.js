const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const path = require('path');
const cors = require('cors');


const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));

const targetURL = 'https://www.yakup.com/search/index.html?csearch_word=%ED%95%AD%EC%95%94&csearch_type=news';

app.get('/api/news', async (req, res) => {
  try {
    const { data } = await axios.get(targetURL);
    const $ = cheerio.load(data);

    const newsList = [];
    $('.info_con li').each((_, el) => {
      const title = $(el).find('.title_con span').text().trim();
      const date = $(el).find('.date').text().trim();
      if (title) newsList.push({ title, date });
    });

    res.json(newsList);
  } catch (err) {
    res.status(500).json({ error: '크롤링 실패' });
  }
});

app.listen(PORT, () => {
  console.log(`✅ 서버 실행 중: http://localhost:${PORT}`);
});
