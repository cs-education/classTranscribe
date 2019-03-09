async function runMigrations() {
    console.log('Running Migrations');
    const { spawn } = require('child-process-promise');
    const migrate = spawn('node_modules/.bin/sequelize', ['db:migrate']);
    migrate.childProcess.stdout.on('data', (data) => {
        console.log(`stdout: ${data}`);
    });

    migrate.childProcess.stderr.on('data', (data) => {
        console.log(`stderr: ${data}`);
    });
    await migrate;
}

module.exports = {
    runMigrations: runMigrations
}