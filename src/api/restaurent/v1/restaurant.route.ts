import { NextFunction, Request, Response, Router } from 'express';
import { RestaurantController } from './restaurant.controller';
import { RestaurantAttrs } from '../restaurant.model';
import { resOk } from '../../../utilities/response.util';
import { parseSafeInterger, toSafeString } from '../../../utilities/data.utils';
import { validateBodyRed } from '../../../middlewares/validation.middleware';
import { IRestaurantFilter } from '../../../interface/restaurant.interface';
import { paginate } from '../../../utilities/paginate.util';
import { upload } from '../../../utilities/media.utils';
import { CreateRestaurantRequest } from '../request/create_restaurant.request';
import { generateRandomString } from '../../../utilities/string.util';

export class RestaurantRouter {
	private controller = new RestaurantController();

	init(router: Router) {
		const restaurantRouter = Router();

		// site owner
		restaurantRouter.post(
			'/',
			upload.single('avatar'),
			validateBodyRed(CreateRestaurantRequest),
			this.create.bind(this),
		);

		// site admin
		restaurantRouter.get('/', this.index.bind(this));
		restaurantRouter.get('/:id', this.detail.bind(this));
		restaurantRouter.put('/:id', this.update.bind(this));
		restaurantRouter.delete('/:id', this.delete.bind(this));

		router.use('/restaurant', restaurantRouter);
	}
	// create
	async create(req: Request, res: Response, next: NextFunction) {
		try {
			const data_body: RestaurantAttrs = req.body;
			data_body.password = generateRandomString(8);
			const restaurant = await this.controller.create(data_body);
			return res.status(200).json(resOk(restaurant));
		} catch (error) {
			next(error);
		}
	}

	// read
	async index(req: Request, res: Response, next: NextFunction) {
		try {
			const { page, limit, offset, sort_by, sort_order } = paginate(req);
			const filter = this.buildFilter(req);

			const data = await this.controller.getMany(filter, {
				limit,
				offset,
				sort_by,
				sort_order,
			});
			return res
				.status(200)
				.json(
					resOk(
						data.rows,
						'success',
						data.count,
						limit,
						page,
						limit ? data.count / limit + 1 : 0,
					),
				);
		} catch (error) {
			next(error);
		}
	}

	async detail(req: Request, res: Response, next: NextFunction) {
		try {
			const id = req.params.id;
			const restaurant = await this.controller.getOne(id);
			return res.status(200).json(resOk(restaurant));
		} catch (error) {
			next(error);
		}
	}

	// update
	async update(req: Request, res: Response, next: NextFunction) {
		try {
			const id = req.params.id;
			const data_body: RestaurantAttrs = req.body;
			const restaurant = await this.controller.update(id, data_body);
			return res.status(200).json(resOk(restaurant));
		} catch (error) {
			next(error);
		}
	}

	// delete
	async delete(req: Request, res: Response, next: NextFunction) {
		try {
			const id = req.params.id;
			const restaurant = await this.controller.destroy(id);
			return res.status(200).json(resOk(restaurant));
		} catch (error) {
			next(error);
		}
	}

	// other function
	buildFilter(req: Request): IRestaurantFilter {
		return {
			code: toSafeString(req.body.code),
			name: toSafeString(req.body.name),
			city: toSafeString(req.body.city),
			district: toSafeString(req.body.district),
			phone: toSafeString(req.body.phone),

			keyword: toSafeString(req.body.keyword),
			address: toSafeString(req.body.address),
			lower_score: parseSafeInterger(req.body.lower_score) ?? undefined,
			higher_score: parseSafeInterger(req.body.lower_score) ?? undefined,
		} as IRestaurantFilter;
	}
}
