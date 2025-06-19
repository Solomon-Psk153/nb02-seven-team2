const { PrismaClient } = require('@prisma/client');
const { object, string, enums, assert, min, integer } = require('superstruct');
const prisma = new PrismaClient();

class TagController {
    static async getTags(req, res, next) {
        try {
            const {
                page = 1,
                limit = 10,
                order = 'desc',
                orderBy = 'createdAt',
                search = ''
            } = req.query;

            try {
                const receivedQuery = {page, limit, order, orderBy, search};
                console.log(receivedQuery);
                const reqTagsVerifyStruct = object({
                    page: min(integer(), 1),
                    limit: min(integer(), 1),
                    order: enums(['asc', 'desc']),
                    orderBy: string(),
                    search: string(),
                });

                assert(receivedQuery, reqTagsVerifyStruct);
            } catch (err) {
                next(err);
            }

            const query = {
                ...(search !== '' && {
                    name: {
                        contain: search,
                        mode: 'insensitive'
                    }
                })
            };
            query.skip = (page - 1) * limit;
            query.take = limit;
            query.orderBy = { [orderBy]: order };

            const tags = await prisma.tag.findMany(query);
            res.status(200).json({ data: tags, total: tags.length });
        } catch (err) {
            next(err);
        }
    }

    static async getTag(req, res, next) {
        try {
            try{
                const reqTagIdVerify = string();
                assert(req.params.tagId, reqTagIdVerify);
            } catch(err){
                next(err);
            }
            const tagId = Number(req.params.tagId);
            const tag = await prisma.tag.findUnique({where: {id:tagId}});
            
            if (!tag) {
                next(new Error('Wrong tag ID'));
            }

            res.status(200).json(tag);
        } catch (err) {
            next(err);
        }
    }
}

module.exports = TagController;