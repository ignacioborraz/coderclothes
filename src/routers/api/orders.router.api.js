import CustomRouter from "../CustomRouter.js";
import { orders } from "../../data/mongo/manager.mongo.js";

export default class OrdersRouter extends CustomRouter {
  init() {
    this.create("/", ["USER", "PREM"], async (req, res, next) => {
      try {
        const { _id } = req.user;
        req.body.user_id = _id;
        const response = await orders.create(req.body);
        return res.success201(response);
      } catch (error) {
        return next(error);
      }
    });
    this.read("/", ["PUBLIC"], async(req,res,next)=> {
      try {
        const response = await orders.read({})
        return res.success200(response)
      } catch (error) {
        return next(error)
      }
    })
  }
}
