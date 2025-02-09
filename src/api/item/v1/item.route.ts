import { NextFunction, Request, Response, Router } from 'express';
import { ItemControler } from './item.controller';
import { ItemAttrs } from '../item.model';
import { resOk } from '../../../utilities/response.util';
import { validateBodyRed } from '../../../middlewares/validation.middleware';
import { CreateItemRequest } from '../request/create_item.request';
import { upload } from '../../../utilities/media.utils';

export class ItemRouter {
	private controller = new ItemControler();

	public init(router: Router) {
		const ItemRouter = Router();

		ItemRouter.post(
			'/',
			upload.single('avatar'),
			validateBodyRed(CreateItemRequest),
			this.create.bind(this),
		);
		ItemRouter.get('/', this.index.bind(this));
		ItemRouter.get('/:id', this.detail.bind(this));
		ItemRouter.put('/:id', this.update.bind(this));
		ItemRouter.delete('/:id', this.delete.bind(this));

		router.use('/item', ItemRouter);
	}
	// create
	async create(req: Request, res: Response, next: NextFunction) {
		try {
			const data_body: ItemAttrs = req.body;
			data_body.restaurant_id = req.restaurant.id;
			const item = await this.controller.create(data_body);
			return res.status(200).json(resOk(item));
		} catch (error) {
			next(error);
		}
	}

	// read
	async index(req: Request, res: Response, next: NextFunction) {
		try {
			const data = await this.controller.getMany();
			return res.status(200).json(resOk(data));
		} catch (error) {
			next(error);
		}
	}

	async detail(req: Request, res: Response, next: NextFunction) {
		try {
			const id = req.params.id;
			const item = await this.controller.getOne(id);
			return res.status(200).json(resOk(item));
		} catch (error) {
			next(error);
		}
	}

	//update
	async update(req: Request, res: Response, next: NextFunction) {
		try {
			const id = req.params.id;
			const data_body = req.body;
			const item = await this.controller.update(id, data_body);
			return res.status(200).json(resOk(item));
		} catch (error) {
			next(error);
		}
	}

	//delete
	async delete(req: Request, res: Response, next: NextFunction) {
		try {
			const id = req.params.id;
			const item = await this.controller.destroy(id);
			return res.status(200).json(resOk(item));
		} catch (error) {
			next(error);
		}
	}

	buildFilter(req: Request) {
		return {};
	}
}
