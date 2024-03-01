import CustomRouter from "../CustomRouter.js";
import ClothesRouter from "./clothes.router.api.js";
import SessionsRouter from "./sessions.router.api.js";
import CategoriesRouter from "./categories.router.api.js";
import SizesRouter from "./sizes.router.api.js";
import OrdersRouter from "./orders.router.api.js";

const session = new SessionsRouter();
const clothes = new ClothesRouter();
const categories = new CategoriesRouter();
const sizes = new SizesRouter();
const orders = new OrdersRouter();

export default class ApiRouter extends CustomRouter {
  init() {
    this.use("/sessions", session.getRouter());
    this.use("/clothes", clothes.getRouter());
    this.use("/categories", categories.getRouter());
    this.use("/sizes", sizes.getRouter());
    this.use("/orders", orders.getRouter());
  }
}
