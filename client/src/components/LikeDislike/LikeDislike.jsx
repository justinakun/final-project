import { useState, useEffect } from "react";
import { SlLike, SlDislike } from "react-icons/sl";
import { updateAnswerLikes } from "../../api/answers";
import "./LikeDislike.scss";

const LikeDislike = ({ answerId, likedBy, dislikedBy, userId }) => {
  const [liked, setLiked] = useState(likedBy.includes(userId));
  const [disliked, setDisliked] = useState(dislikedBy.includes(userId));
  const [likeCount, setLikeCount] = useState(likedBy.length);
  const [dislikeCount, setDislikeCount] = useState(dislikedBy.length);

  useEffect(() => {
    setLikeCount(likedBy.length);
    setDislikeCount(dislikedBy.length);
  }, [likedBy, dislikedBy]);

  const handleLike = async () => {
    try {
      let updatedLikedBy = likedBy;
      let updatedDislikedBy = dislikedBy;

      if (liked) {
        updatedLikedBy = likedBy.filter((id) => id !== userId);
      } else {
        if (!likedBy.includes(userId)) {
          updatedLikedBy.push(userId);
        }

        updatedDislikedBy = dislikedBy.filter((id) => id !== userId);
      }

      await updateAnswerLikes(answerId, updatedLikedBy, updatedDislikedBy);

      setLiked(updatedLikedBy.includes(userId));
      setLikeCount(updatedLikedBy.length);
      setDisliked(updatedDislikedBy.includes(userId));
      setDislikeCount(updatedDislikedBy.length);
    } catch (error) {
      console.error("Error updating likes:", error);
    }
  };

  const handleDislike = async () => {
    try {
      let updatedDislikedBy = dislikedBy;
      let updatedLikedBy = likedBy;

      if (disliked) {
        updatedDislikedBy = dislikedBy.filter((id) => id !== userId);
      } else {
        if (!dislikedBy.includes(userId)) {
          updatedDislikedBy.push(userId);
        }

        updatedLikedBy = likedBy.filter((id) => id !== userId);
      }

      await updateAnswerLikes(answerId, updatedLikedBy, updatedDislikedBy);

      setLiked(updatedLikedBy.includes(userId));
      setLikeCount(updatedLikedBy.length);
      setDisliked(updatedDislikedBy.includes(userId));
      setDislikeCount(updatedDislikedBy.length);
    } catch (error) {
      console.error("Error updating dislikes:", error);
    }
  };

  return (
    <div className="like-dislike-container">
      <div onClick={liked ? null : handleLike} className="like-container">
        <SlLike className="like-icon" />

        <div className="like-count">{likeCount}</div>
      </div>
      <div
        onClick={disliked ? null : handleDislike}
        className="dislike-container"
      >
        <SlDislike className="dislike-icon" />
        <div className="dislike-count">{dislikeCount}</div>
      </div>
      <div>
        {liked ? "You liked" : ""}
        {disliked ? "You disliked" : ""}
      </div>
    </div>
  );
};

export default LikeDislike;
