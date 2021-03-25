const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto')
const { transport, makeEmail } = require('../mail');
const { hasPermission } = require("../utils");
const stripeConfig = require('../stripe');

const Mutation = {
    createItem: async (parent, args, context, info) => {
        //TODO: check if they are logged in
        if(!context.req.userId) {
            throw new Error('You must be logged in to do that!');
        }

        const newItem = await context.prisma.item.create({ 
            data: {
                user: {
                    connect: {
                        id: context.req.userId
                    }
                },
                ...args.data
            } 
        })
        return newItem
    },
    updateItem: async (parent, args, context, info) => {
        const updates = { ...args.data };
        delete updates.id;

        const item = await context.prisma.item.update({
            where: { id: args.data.id },
            data: updates
        })
        return item
    },
    deleteItem: async (parent, args, context, info) => {
        const where = { id : args.id };
        const item = await context.prisma.item.findUnique({ where });
        const ownsItem = item.userId === context.req.userId;

        const user = await context.prisma.user.findUnique({
            where: {
                id : context.req.userId
            }
        });
        const hasPermissions = user.permissions.some(permission => (
            ['ADMIN', 'PERMISSIONUPDATE'].includes(permission)
        ))
        if(!ownsItem && !hasPermissions) {
            throw new Error("You do not have the required permisssion");
        }
        const itemx = await context.prisma.item.delete({ where });
        return itemx
    },
    signin:  async (parent, { data: {email, password} }, context, info) => {
        const user = await context.prisma.user.findUnique({
            where: { email }
        });
        if(!user) {
            throw new Error(`No user found with the email ${email}`)
        }
        const valid = await bcrypt.compare(password, user.password);
        if(!valid) {
            throw new Error('Invalid Password');
        }
        const token = jwt.sign({
            userId: user.id
        }, process.env.APP_SECRET);

        context.res.cookie('token', token, {
            httpOnly: true, 
            maxAge: 1000 * 60 * 60 * 24 * 365 //1year cookie
        })
        return user;
    },
    signup: async (parent, args, context, info) => {
        args.data.email = args.data.email.toLowerCase();
        const password = await bcrypt.hash(args.data.password, 10);
        const user = await context.prisma.user.create({
            data: {
                ...args.data,
                password,
                permissions: { set: ['USER'] }
            }
        }, info);
        const token = jwt.sign({
            userId: user.id
        }, process.env.APP_SECRET);

        context.res.cookie('token', token, {
            httpOnly: true, 
            maxAge: 1000 * 60 * 60 * 24 * 365 //1year cookie
        })
        return user;
    },
    signout: async (parent, args, context, info) => {
        context.res.clearCookie('token');
        return { message: "Goodbye!"}
    },
    requestReset: async (parent, args, context, info) => {
        const user =  await context.prisma.user.findUnique({
            where: {
                email: args.email
            }
        });
        if(!user) {
            throw new Error(`No user found with email ${args.email}`)
        }

        let resetToken = await crypto.randomBytes(20).toString('hex');
        const resetTokenExpiry = Date.now() + 3600000; //1 hour from now

        const res =  await context.prisma.user.update({
            where: {email: args.email},
            data: { resetToken, resetTokenExpiry }
        })
        const mailRes = await transport.sendMail({
            from: 'kunle@kodes.com',
            to: user.email,
            subject: 'Password Reset Request',
            html: makeEmail(`Your Password Reset Token is here! 
                \n\n 
                <a href="${process.env.FRONTEND_URL}/reset?resetToken=${resetToken}">Click here to reset</a>
            `)
        });
        return {message: "Token set"}
    },
    resetPassword: async (parent, args, context, info) => {
        if(args.password !== args.confirmPassword) {
            throw new Error("Passwords do not match");
        }
        const [user] = await context.prisma.user.findMany({
            where: {
                resetToken: args.resetToken,
                resetTokenExpiry: {
                    gte: Date.now() - 3600000
                } 
            }
        });
        if(!user) {
            throw new Error("This token is either invalid or expired!");
        }
        const password = await bcrypt.hash(args.password, 10);

        const updatedUser = await context.prisma.user.update({
            where: {id: user.id},
            data: {
                password,
                resetToken: null,
                resetTokenExpiry: null
            }
        });
        const token = jwt.sign({
            userId: updatedUser.id,
        }, process.env.APP_SECRET);

        context.res.cookie('token', token, {
            httpOnly: true, 
            maxAge: 1000 * 60 * 60 * 24 * 365 //1year cookie
        })
        return updatedUser;
    },
    updatePermissions: async (parent, args, context, info) => {
        if(!context.req.userId) {
            throw new Error ('You must be logged in!')
        }
        const user = await context.prisma.user.findUnique({
            where: {
                id : context.req.userId
            }
        });
        hasPermission(user, ["ADMIN", "PERMISSIONUPDATE"])
        return context.prisma.user.update({
            data: {
                permissions: {
                    set: args.permissions
                }
            },
            where: {
                id: args.userId
            }
        })
    },
    addToCart: async (parent, args, context, info) => {
        if(!context.req.userId) {
            throw new Error ('You must be logged in!')
        }
        const existingCartItem = await context.prisma.cartItem.findFirst({
            where: {
                userId: context.req.userId,
                itemId: args.id
            }
        })
        if(existingCartItem) {
            return context.prisma.cartItem.update({
                where: {
                    id: existingCartItem.id
                },
                data: {
                    quantity: existingCartItem.quantity + 1
                }
            })
        }
        return context.prisma.cartItem.create({
            data: {
                user: {
                    connect: { id: context.req.userId }
                },
                item: {
                    connect: { id: args.id }
                }
            }
        })
    },
    removeFromCart: async (parent, args, context, info) => {
        if(!context.req.userId) {
            throw new Error ('You must be logged in!');
        }
        const cartItem = await context.prisma.cartItem.findUnique({
            where: {
                id: args.id
            }
        });
        if(!cartItem) {
            throw new Error("No CartItem Found!")
        }
        if(cartItem.userId !== context.req.userId) {
            throw new Error ('Cheating huhh');
        };
        return context.prisma.cartItem.delete({
            where: {
                id: args.id
            }
        })
    },
    createOrder: async (parent, args, context, info) => {
        const { userId } = context.req;
        if(!userId) {
            throw new Error ('You must be signed in to complete this order!');
        }    
        const user = await context.prisma.user.findUnique({ 
            where: { 
                id: userId 
            }, 
            include: {
                cart: {
                    include: {
                        item: true
                    }
                }
            } 
        });
        const amount = user.cart.reduce((tally, cartItem) => (
            tally + cartItem.item.price * cartItem.quantity
        ), 0);
        const charge = await stripeConfig.paymentIntents.create({
            amount,
            currency: 'USD',
            confirm: true,
            payment_method: args.token
        }).catch(err => {
            throw new Error(err.message);
        });

        const orderItems = user.cart.map(cartItem => {
            const orderItem = {
                title: cartItem.item.title,
                description: cartItem.item.description,
                quantity: cartItem.quantity,
                price: cartItem.item.price,
                image: cartItem.item.image,
                largeImage: cartItem.item.largeImage,
                user: { connect: { id: userId } }
            }
            return orderItem;
        });

        const order = await context.prisma.order.create({
            data: {
                total: charge.amount,
                charge: charge.id,
                items: { create: orderItems },
                user: { connect: { id: userId } }
            }
        });

        await context.prisma.cartItem.deleteMany({
            where: {
                id: {
                    in: user.cart.map(item => item.id)
                }
            }
        });
        return order;
    }
}

module.exports = Mutation
