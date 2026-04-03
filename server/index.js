require('dotenv').config({ override: true });

const express = require('express');
const cors    = require('cors');
const path    = require('path');
const mongoose = require('mongoose');

const booksRouter     = require('./routes/books');
const ordersRouter    = require('./routes/orders');
const templatesRouter = require('./routes/templates');
const uploadRouter    = require('./routes/upload');
const llmRouter       = require('./routes/llm');
const authRouter      = require('./routes/auth');

const app  = express();
const PORT = process.env.PORT || 4000;

mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:3000' }));
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

app.use('/api/auth', authRouter);
app.use('/api/books', booksRouter);
app.use('/api/orders', ordersRouter);
app.use('/api/templates', templatesRouter);
app.use('/api/upload', uploadRouter);
app.use('/api/llm', llmRouter);

app.get('/health', (req, res) => res.json({ status: 'ok' }));

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
