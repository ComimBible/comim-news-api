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


// 메모리 캐시 변수
let cache = {
  timestamp: 0,
  data: null,
};

const CACHE_DURATION = 24 * 60 * 60 * 1000; // 5분


app.get('/api/news', async (req, res) => {
  const now = Date.now();

  if (cache.data && now - cache.timestamp < CACHE_DURATION) {
    return res.json(cache.data);
  }

  try {
    const { data } = await axios.get(targetURL);
    const $ = cheerio.load(data);

    const newsList = [];
    $(".info_con li").each((_, el) => {
      const title = $(el).find(".title_con span").text().trim();
      const date = $(el).find(".date").text().trim();
      const url = "https://www.yakup.com" + $(el).find("a").attr("href");
      const thumb = $(el).find(".thum_con")[0]?.attribs?.style;
      const thumbUrl = thumb?.match(/url\(['"]?(.*?)['"]?\)/)?.[1] || null;

      if (title) newsList.push({ title, date, url, thumbUrl });

      // console.log(title, urlAddr, date);
    });

    // 캐시 저장
    cache = {
      timestamp: now,
      data: newsList,
    };

    res.json(newsList);
  } catch (err) {
    res.status(500).json({ error: '크롤링 실패' });
  }
});

app.listen(PORT, () => {
  console.log(`✅ 서버 실행 중: http://localhost:${PORT}`);
});
