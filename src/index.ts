import 'dotenv/config';
import 'reflect-metadata';
import { initApp } from 'app';

(async () => {
  try {
    const app = await initApp();
    const port = process.env.PORT || 4000;
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  } catch (error) {
    console.error(`Error establishing database connection: ${error.message}`);
    process.exit(1);
  }
})();
