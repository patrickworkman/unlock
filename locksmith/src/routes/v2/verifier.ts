import { userMatchAddress } from './../../utils/middlewares/userMatchAddress'
import express from 'express'
import VerifierController from '../../controllers/v2/verifierController'
import { authenticatedMiddleware } from '../../utils/middlewares/auth'
import { lockManagerMiddleware } from '../../utils/middlewares/lockManager'

const router = express.Router({ mergeParams: true })

const verifierController = new VerifierController()

router.use('/', authenticatedMiddleware)

router.get('/list/:network/:lockAddress', lockManagerMiddleware, (req, res) =>
  verifierController.list(req, res)
)

router.put(
  '/:network/:lockAddress/:verifierAddress',
  lockManagerMiddleware,
  (req, res) => verifierController.addVerifier(req, res)
)

router.delete(
  '/:network/:lockAddress/:verifierAddress',
  lockManagerMiddleware,
  (req, res) => verifierController.removeVerifier(req, res)
)

router.get(
  '/enabled/:network/:lockAddress/:verifierAddress',
  userMatchAddress,
  (req, res) => verifierController.isVerifierEnabled(req, res)
)

router.put(
  '/:network/lock/:lockAddress/key/:keyId/check',
  lockManagerMiddleware,
  (req, res) => {
    verifierController.markTicketAsCheckIn(req, res)
  }
)
module.exports = router
