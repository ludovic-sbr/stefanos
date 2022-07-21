const User = require('../models/User')
const Subscription = require('../models/Subscription')
const UserSubscription = require('../models/UserSubscription')
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const subscriptionsController = () => {};


// POST _______________________________________________________________________
subscriptionsController.new = async (req, res) => {
    try {
        let user = await User.findOne({
            username: req.body.username
        })
        let subscription = await Subscription.findById(req.body.subscription_id)

        let existingSubscription = await UserSubscription.findOne({
            user: user,
            subscription: subscription,
        })

        if (!user || !subscription || existingSubscription) throw new Error

        await UserSubscription.create({
            user: user,
            subscription: subscription,
            stripeSubId: req.body.stripe_subscription_id === "" ? null : req.body.stripe_subscription_id,
            stripePaymentIntent: req.body.stripe_payment_intent
        })

        res.sendStatus(201)
    } catch (err) {
        res.status(400)
        res.send(err.message)
    }
}


// GET _______________________________________________________________________
subscriptionsController.getAll = async (req, res) => {
    try {
        let all_user_subscriptions = await UserSubscription.find().populate("user").populate("subscription")

        res.status(200)
        res.send({ success: true, all_user_subscriptions})
    } catch (err) {
        res.status(400)
        res.send({ success: false, message: "Aucun abonnement trouvé." })
    }
}

subscriptionsController.get = async (req, res) => {
    try {
        let user = await User.findById(req.params.userID)

        let user_subscriptions = await UserSubscription.find({
            user: user
        }).populate("subscription")

        res.status(200)
        res.send({ success: true, user_subscriptions})

    } catch (err) {
        res.status(400)
        res.send({ success: false, message: "Aucun abonnement trouvé." })
    }
}

subscriptionsController.getTypes = async (req, res) => {
    try {
        let subscriptionTypes = await Subscription.find().populate("event")

        res.status(200)
        res.send({ success: true, subscriptionTypes })
    } catch (err) {
        console.log(err.message)
        res.status(400)
        res.send({ success: false, message: "Aucun type d'abonnement trouvé." })
    }
}


// DELETE _____________________________________________________________
subscriptionsController.deleteAll = async (req, res) => {
    try {
        await UserSubscription.deleteMany()

        let allStripeSubscriptions = await stripe.subscriptions.list({
            status: "active"
        })

        if (allStripeSubscriptions.data !== []) {
            allStripeSubscriptions.data.map(async (sub) => {
                await stripe.subscriptions.del(sub.id)
            })
        }

        res.sendStatus(200)
    } catch (err) {
        console.log(err.message)
        res.sendStatus(400)
    }
}

subscriptionsController.delete = async (req, res) => {
    try {
        let deletedSubscription = await UserSubscription.findOneAndDelete({
            _id: req.params.userSubscriptionId
        })

        console.log(deletedSubscription)

        if (!deletedSubscription) throw new Error

        if (deletedSubscription.stripeSubId !== null) {
            await stripe.subscriptions.del(deletedSubscription.stripeSubId);
        }

        res.sendStatus(200)
    } catch (err) {
        console.log(err.message)
        res.sendStatus(400)
    }
}


module.exports = subscriptionsController;