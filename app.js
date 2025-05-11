const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');

const TailorRouter = require('./routes/TailorRouter');
const CustomerRouter = require('./routes/CustomerRouter');
const AuthRouter = require('./routes/AuthRouter');
const ProductRouter = require('./routes/ProductRouter');
const ReviewRouter = require('./routes/ReviewRouter');
const AppointmentRouter = require('./routes/AppointmentRouter');
const OrderRouter = require('./routes/OrderRouter');

const { createTailorTable } = require('./models/tailor');
const { createCustomerTable } = require('./models/customer');
const { createItemsTable } = require('./models/items');
const { createReviewTable } = require('./models/review');
const { createAppointmentTable } = require('./models/appointments');
const { createOfflineOrdersTable } = require('./models/offlineorders');

require('dotenv').config();
require('./models/db');

const PORT = process.env.PORT || 3000;

app.use(bodyParser());
app.use(cors());

createTailorTable();
createCustomerTable();
createItemsTable();
createReviewTable();
createAppointmentTable();
createOfflineOrdersTable();

app.get("/", (req, res)=>{
    res.send("hello");
});

app.use('/auth',AuthRouter);
app.use('/tailor-management',TailorRouter);
app.use('/customer-management',CustomerRouter);
app.use('/review',ReviewRouter);
app.use('/appointments',AppointmentRouter);
app.use('/order', OrderRouter);

app.use('/products',ProductRouter);


app.listen(PORT, ()=>{
    console.log(`Server is running on ${PORT}`);
    
});