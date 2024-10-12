import express from 'express';
import bodyParser from 'body-parser';
import logger from 'morgan';

const products = [{
  "id": 1,
  "product_name": "Beets - Pickled",
  "quantity": 14
}, {
  "id": 2,
  "product_name": "Molasses - Fancy",
  "quantity": 86
}, {
  "id": 3,
  "product_name": "Coffee - Decafenated",
  "quantity": 8
}, {
  "id": 4,
  "product_name": "Sprouts - Alfalfa",
  "quantity": 4
}, {
  "id": 5,
  "product_name": "Pasta - Spaghetti, Dry",
  "quantity": 93
}, {
  "id": 6,
  "product_name": "Bread - Bagels, Plain",
  "quantity": 20
}, {
  "id": 7,
  "product_name": "Macaroons - Two Bite Choc",
  "quantity": 61
}, {
  "id": 8,
  "product_name": "Cheese - Ermite Bleu",
  "quantity": 3
}, {
  "id": 9,
  "product_name": "Sugar - Brown, Individual",
  "quantity": 81
}, {
  "id": 10,
  "product_name": "Test",
  "quantity": 1000
}]

// set up dependencies
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(logger('dev'));

// set up port
const port = 3080;

const router = express.Router();
router.get('/products', (req: express.Request, res: express.Response) => {
  return res.status(200).json({
    success: true,
    message: 'Get products successfully',
    Products: products,
  });
});

app.use('/api/', router);

// set up route
app.get('/', (req, res) => {
  res.status(200).json({
    message: 'Welcome to Project with Nodejs Express and MongoDB',
  });
});
app.listen(port, () => {
  console.log(`Our server is running on port ${port}`);
});
