export default function checkAdmin(req, res, next) {
  if (!req.user || !req.user.isAdmin) {
    return res.status(403).json({ error: 'Solo gli admin possono fare questa operazione' });
  }
  next();
}
