const { db, sequelizeInstances } = require("../../config/sequelize");
const response = require("../tools/response");

exports.createExample = async (req, res) => {
    try {
        req.body.is_deleted = 0;
        req.body.created_at = new Date();
        req.body.created_by = req.user.employee_code;
        req.body.updated_at = new Date();
        req.body.updated_by = req.user.employee_code;

        const example = await db.example.example.create(req.body);
        response(req, res, {
            status: 200,
            data: example,
        });
    } catch (error) {
        console.error(error);
        response(req, res, {
            status: error.name === 'SequelizeUniqueConstraintError' ? 409 : 500,
            data: error,
        });
    }
};

exports.getAllExample = async (req, res) => {
    try {
        // Define optional filters
        const filters = {};

        // Check if startDate and endDate are provided as query parameters
        if (req.query.startDate && req.query.endDate) {
            filters.updated_at = {
                $between: [req.query.startDate, req.query.endDate],
            };
        }

        if (req.query.status) {
            filters.status = req.query.status;
        }
        // Add more filters as needed

        const examples = await db.tugas1.karyawan.findAll({
            order:[['id_karyawan', 'DESC']]
        });

        response(req, res, {
            status: 200,
            data: examples,
        });
    } catch (error) {
        console.error(error);
        response(req, res, {
            status: 500,
            data: error,
        });
    }
};

exports.getExampleById = async (req, res) => {
    try {
        const example = await db.example.example.findByPk(req.params.id);

        response(req, res,
            data.length > 0
                ? { status: 200, data: example }
                : { status: 404, example: "Data not found" }
        );
    } catch (error) {
        console.error(error);
        response(req, res, {
            status: 500,
            data: error,
        });
    }
};

exports.updateExample = async (req, res) => {
    try {
        const example = await db.example.example.findByPk(req.params.id);
        if (!example) {
            response(req, res, {
                status: 404,
                example: 'Example not found',
            });
        } else {
            req.body.updated_at = new Date();
            req.body.updated_by = req.user.employee_code;
            await example.update(req.body);
            response(req, res, {
                status: 200,
                data: example,
            });
        }
    } catch (error) {
        console.error(error);
        response(req, res, {
            status: error.name === 'SequelizeUniqueConstraintError' ? 409 : 500,
            data: error,
        });
    }
};

exports.deleteExample = async (req, res) => {
    try {
        const example = await db.example.example.findByPk(req.params.id);
        if (!example) {
            response(req, res, {
                status: 404,
                message: 'Example not found',
            });
        } else {
            // Perform a "soft" delete by updating the is_deleted column
            await example.update({ is_deleted: 1, updated_at: new Date(), updated_by: req.user.employee_code });
            response(req, res, {
                status: 200,
                data: example,
            });
        }
    } catch (error) {
        console.error(error);
        response(req, res, {
            status: 500,
            data: error,
        });
    }
};

exports.deleteBulkExample = async (req, res) => {
    try {
        const ids = req.params.ids.split(',').map(id => parseInt(id));
        const examples = await db.example.example.findAll({
            where: {
                id: ids
            }
        });
        if (examples.length !== ids.length) {
            response(req, res, {
                status: 404,
                message: 'Example not found',
            });
        } else {
            // Perform a "soft" delete by updating the is_deleted column
            await db.example.example.update({
                is_deleted: 1,
                updated_at: new Date(),
                updated_by: req.user.employee_code
            }, {
                where: {
                    id: ids
                }
            });
            // await example.update({ is_deleted: 1 });
            response(req, res, {
                status: 200,
                data: examples,
            });
        }
    } catch (error) {
        console.error(error);
        response(req, res, {
            status: 500,
            data: error,
        });
    }
};
