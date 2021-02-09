const FriendRequest = require('../models/friendRequest');
const User = require('../models/user');
const AppError = require('../utils/appError');

exports.sendFriendRequest = async (req, res, next) => {
  try {
    let fromUserId = req.session.userId;
    let fromUser = await User.findById(fromUserId);
    let { toUserId } = req.body;
    const toUser = await User.findById(toUserId);
    if (!toUser)
      return res.status(400).json({ message: 'user does not exist' });
    if (fromUser.isFriend(toUserId))
      return res.status(400).json({ message: 'user is already friend!' });
    let fr = await FriendRequest.findOne({ from: fromUserId, to: toUserId });
    if (fr)
      return res.status(400).json({ message: 'friend request already sent!' });

    let friendRequest = await FriendRequest.create({
      from: fromUserId,
      to: toUserId,
      status: 'pending'
    });
    res.status(200).json({
      friendRequest: friendRequest
    });
  } catch (error) {
    next(new AppError(error.message, 400));
  }
};

exports.acceptFriendRequest = async (req, res, next) => {
  try {
    let userId = req.session.userId;
    let frId = req.params.id;
    let fr = await FriendRequest.findOne({
      _id: frId,
      to: userId,
      status: { $in: ['pending', 'seen'] }
    });

    if (!fr) return res.status(400).json({ message: 'request not found' });

    fr.status = 'accepted';
    await fr.save();

    let fromUser = await User.findById(fr.from);
    let toUser = await User.findById(fr.to);

    fromUser.friends.push(fr.to);
    toUser.friends.push(fr.from);

    await fromUser.save();
    await toUser.save();

    res.status(200).json({ message: 'You are now friends' });
  } catch (error) {
    console.log(error);
    next(new AppError(error.message, 400));
  }
};

exports.declineFriendRequest = async (req, res, next) => {
  try {
    let userId = req.session.userId;
    let frId = req.params.id;
    let fr = await FriendRequest.findOne({
      _id: frId,
      to: userId,
      status: { $in: ['pending', 'seen'] }
    });

    if (!fr) return res.status(400).json({ message: 'request not found' });

    fr.status = 'declined';
    await fr.save();

    res.status(200).json({ message: 'friend request has been declined' });
  } catch (error) {
    next(new AppError(error.message, 400));
  }
};

exports.getFriendRequests = async (req, res, next) => {
  try {
    let userId = req.session.userId;
    let frs = await FriendRequest.find({
      to: userId,
      status: { $in: ['pending', 'seen'] }
    }).populate('from', 'firstName lastName profilePicUrl');

    res.status(200).json({
      friendRequests: frs
    });
  } catch (error) {
    next(new AppError(error.message, 400));
  }
};
