const fs = require("fs");
const path = require("path");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;

// change format name to camelcase
const toCamelCaseName = (str) => {
    return str
        .toLowerCase()
        .replace(/_(.)/g, (_, match) => match.toUpperCase());
};

// Define directories
const directories = {
    [toCamelCaseName(
        process.env.MYSQL_TEMPLATING_NAME
    )]: `../src/models/${toCamelCaseName(
        process.env.MYSQL_TEMPLATING_NAME
    )}`,
   
    // [toCamelCaseName(
    //     process.env.MSSQL_RAMCO_NAME
    // )]: `../src/models/${toCamelCaseName(
    //     process.env.MSSQL_RAMCO_NAME
    // )}`,
  
};

// Define operatorsAliases
const operatorsAliases = {
    $and: Op.and,
    $or: Op.or,
    $eq: Op.eq,
    $ne: Op.ne,
    $gt: Op.gt,
    $lt: Op.lt,
    $lte: Op.lte,
    $like: Op.like,
    $between: Op.between,
    $not: Op.not,
};

// Define pool configurations
const poolConfigurations = {
    [toCamelCaseName(process.env.MYSQL_TEMPLATING_NAME)]: {
        min: Number(process.env.MYSQL_TEMPLATING_POOL_MIN),
        max: Number(process.env.MYSQL_TEMPLATING_POOL_MAX),
        idle: Number(process.env.MYSQL_TEMPLATING_POOL_IDLE),
        acquire: Number(process.env.MYSQL_TEMPLATING_POOL_ACQUIRE),
        evict: Number(process.env.MYSQL_TEMPLATING_POOL_EVICT),
        handleDisconnects: true,
    },
    // [toCamelCaseName(process.env.MSSQL_USER_NAME)]: {
    //     min: Number(process.env.MSSQL_USER_POOL_MIN),
    //     max: Number(process.env.MSSQL_USER_POOL_MAX),
    //     idle: Number(process.env.MSSQL_USER_POOL_IDLE),
    //     acquire: Number(process.env.MSSQL_USER_POOL_ACQUIRE),
    //     evict: Number(process.env.MSSQL_USER_POOL_EVICT),
    //     handleDisconnects: true,
    // },
    // [toCamelCaseName(process.env.MSSQL_RAMCO_NAME)]: {
    //     min: Number(process.env.MSSQL_RAMCO_POOL_MIN),
    //     max: Number(process.env.MSSQL_RAMCO_POOL_MAX),
    //     idle: Number(process.env.MSSQL_RAMCO_POOL_IDLE),
    //     acquire: Number(process.env.MSSQL_RAMCO_POOL_ACQUIRE),
    //     evict: Number(process.env.MSSQL_RAMCO_POOL_EVICT),
    //     handleDisconnects: true,
    // },
    // [toCamelCaseName(process.env.POSTGRE_PMS_NAME)]: {
    //     min: Number(process.env.POSTGRE_PMS_POOL_MIN),
    //     max: Number(process.env.POSTGRE_PMS_POOL_MAX),
    //     idle: Number(process.env.POSTGRE_PMS_POOL_IDLE),
    //     acquire: Number(process.env.POSTGRE_PMS_POOL_ACQUIRE),
    //     evict: Number(process.env.POSTGRE_PMS_POOL_EVICT),
    //     handleDisconnects: true,
    // },
    // Add other pool configurations as needed
};

// Define sequelize configurations
const sequelizeConfigurations = {
    [toCamelCaseName(process.env.MYSQL_TEMPLATING_NAME)]: {
        host: process.env.MYSQL_TEMPLATING_HOST,
        dialect: process.env.MYSQL_TEMPLATING_DIALECT,
        database: process.env.MYSQL_TEMPLATING_NAME,
        username: process.env.MYSQL_TEMPLATING_USER,
        password: process.env.MYSQL_TEMPLATING_PASS,
        pool: poolConfigurations[toCamelCaseName(process.env.MYSQL_TEMPLATING_NAME)],
        port: Number(process.env.MYSQL_TEMPLATING_PORT),
        define: {
            timestamps: false,
            timezone: "+07:00",
        },
        logging: Boolean(process.env.MYSQL_TEMPLATING_LOGGING),
        timezone: "+07:00",
        operatorsAliases: operatorsAliases,
    },
    // [toCamelCaseName(process.env.MSSQL_USER_NAME)]: {
    //     host: process.env.MSSQL_USER_HOST,
    //     dialect: process.env.MSSQL_USER_DIALECT,
    //     database: process.env.MSSQL_USER_NAME,
    //     username: process.env.MSSQL_USER_USER,
    //     password: process.env.MSSQL_USER_PASS,
    //     pool: poolConfigurations[toCamelCaseName(process.env.MSSQL_USER_NAME)],
    //     port: Number(process.env.MSSQL_USER_PORT),
    //     define: {
    //         timestamps: false,
    //         timezone: "+07:00",
    //     },
    //     // dialectOptions: {
    //     //     options: {
    //     //         encrypt: false,
    //     //     },
    //     // },
    //     logging: Boolean(process.env.MSSQL_USER_LOGGING),
    //     timezone: "+07:00",
    //     operatorsAliases: operatorsAliases,
    // },
    // [toCamelCaseName(process.env.MSSQL_RAMCO_NAME)]: {
    //     host: process.env.MSSQL_RAMCO_HOST,
    //     dialect: process.env.MSSQL_RAMCO_DIALECT,
    //     database: process.env.MSSQL_RAMCO_NAME,
    //     username: process.env.MSSQL_RAMCO_USER,
    //     password: process.env.MSSQL_RAMCO_PASS,
    //     pool: poolConfigurations[toCamelCaseName(process.env.MSSQL_RAMCO_NAME)],
    //     port: Number(process.env.MSSQL_RAMCO_PORT),
    //     define: {
    //         timestamps: false,
    //         timezone: "+07:00",
    //     },
    //     logging: Boolean(process.env.MSSQL_RAMCO_LOGGING),
    //     timezone: "+07:00",
    //     operatorsAliases: operatorsAliases,
    // },
    // [toCamelCaseName(process.env.POSTGRE_PMS_NAME)]: {
    //     host: process.env.POSTGRE_PMS_HOST,
    //     dialect: process.env.POSTGRE_PMS_DIALECT,
    //     database: process.env.POSTGRE_PMS_NAME,
    //     username: process.env.POSTGRE_PMS_USER,
    //     password: process.env.POSTGRE_PMS_PASS,
    //     pool: poolConfigurations[toCamelCaseName(process.env.POSTGRE_PMS_NAME)],
    //     port: Number(process.env.POSTGRE_PMS_PORT),
    //     define: {
    //         timestamps: false,
    //         timezone: "+07:00",
    //     },
    //     logging: Boolean(process.env.POSTGRE_PMS_LOGGING),
    //     timezone: "+07:00",
    //     operatorsAliases: operatorsAliases,
    // },
    // Add other sequelize configurations as needed
};

// Initialize sequelize instances
const sequelizeInstances = {};
for (const [key, config] of Object.entries(sequelizeConfigurations)) {
    sequelizeInstances[key] = new Sequelize(config);
}

// Authenticate sequelize instances
const authenticateSequelize = async (instanceName) => {
    try {
        await sequelizeInstances[instanceName].authenticate();
        console.log(`[OK] DB ${instanceName.toUpperCase()} connected!`);
    } catch (error) {
        console.error(
            `[ERR] DB ${instanceName.toUpperCase()} connection error!`,
            error
        );
    }
};

// Authenticate all sequelize instances
for (const instanceName in sequelizeInstances) {
    authenticateSequelize(instanceName);
}

// Initialize db object
const db = {};
let model;

// Define models and associations
const defineModels = (directory, sequelizeInstance) => {
    db[directory] = {};
    fs.readdirSync(path.join(__dirname, directories[directory]))
        .filter(
            (file) => file.indexOf(".") !== 0 && file.indexOf(".map") === -1
        )
        .forEach((file) => {
            model = require(path.join(__dirname, directories[directory], file))(
                sequelizeInstance,
                Sequelize.DataTypes
            );
            db[directory][model.name] = model;
        });

    Object.keys(db[directory]).forEach((name) => {
        if ("associate" in db[directory][name]) {
            db[directory][name].associate(db[directory]);
        }
    });
};

// Define models and associations for each directory
for (const directory in directories) {
    defineModels(directory, sequelizeInstances[directory]);
}

module.exports = {
    db,
    sequelizeInstances,
    Op,
    Sequelize
};
