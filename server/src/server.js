import app from './app.js'
import 'dotenv/config'

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server is ruining on http://localhost:${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});