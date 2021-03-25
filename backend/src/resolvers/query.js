const { hasPermission } = require("../utils");

const Query = {

    getAllUsers: async (_, args, context, info) => {
        if(!context.req.userId) {
            throw new Error("You must be logged in to continue")
        }
        const user = await context.prisma.user.findUnique({
            where: {
                id : context.req.userId
            }
        });
        hasPermission(user, ["ADMIN", "PERMISSIONUPDATE"])

        return context.prisma.user.findMany({ orderBy: {name: 'asc'} });
    },
    me: async (_, arg, context, info) => {
        if(!context.req.userId) {
            return null;
        }
        const user = await context.prisma.user.findUnique({
            where: {
                id : context.req.userId
            },
            include: {
                cart: {
                    include: {
                        item: true
                    }
                }
            }
        })
        return user
    },
    getAllItems: async (_, args, context, info) => {
        if(args.searchTerm) {
            return context.prisma.item.findMany({
                where: {
                    OR: [
                        {
                            title: {
                                contains: args.searchTerm,
                                mode: 'insensitive'
                            }
                        },
                        {
                            description: {
                                contains: args.searchTerm,
                                mode: 'insensitive'
                            }
                        }
                    ]
                }
            })
        }
        return context.prisma.item.findMany({...args})
    },
    getItem: async (_, arg, context, info) => {
        const item = await context.prisma.item.findUnique({
            where: {
                id : arg.id
            }
        })
        return item
    },
    itemsCount: async (_, args, context) => {
        return context.prisma.item.count();
    },
    order:  async (parent, { id }, context, info) => {
        if(!context.req.userId) {
            return null;
        }
        const order = await context.prisma.order.findUnique({
            where: { id },
            include: {
                items: true
            }
        });
        if(!order) {
            throw new Error(`Order with id ${id} cannot be found`)
        }
        return order
    },
    orders: async (parent, args, context, info) => {
        if(!context.req.userId) {
            return null;
        }
        return context.prisma.order.findMany({
            where: {
                userId: context.req.userId
            },
            include: {
                items: true
            }
        });
    }
}

module.exports = Query

