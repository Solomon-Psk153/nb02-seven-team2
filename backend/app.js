const express = require('express');
const cors = require('cors');
const { swaggerSpec, swaggerUi } = require('./swagger/swagger');

const app = express();

app.use(cors());
app.use(express.json());
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));


app.get('/', (req, res) => {
  res.send('서버가 정상적으로 실행 중');
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('서버 에러 발생!');
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`서버 실행 중 http://localhost:${PORT}`);
});
