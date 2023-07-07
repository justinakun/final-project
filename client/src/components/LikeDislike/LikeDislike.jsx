import { useState, useEffect } from "react";
import { SlLike, SlDislike } from "react-icons/sl";
import { updateAnswerLikes } from "../../api/answers";

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
    <div>
      <div onClick={liked ? null : handleLike}>
        <SlLike />
        <p>{liked ? "You liked" : "Like"}</p>
        <p>
          {likeCount} {likeCount === 1 ? "person likes" : "people like"}
        </p>
      </div>
      <div onClick={disliked ? null : handleDislike}>
        <SlDislike />
        <p>{disliked ? "You disliked" : "Dislike"}</p>
        <p>
          {dislikeCount}{" "}
          {dislikeCount === 1 ? "person dislikes" : "people dislike"}
        </p>
      </div>
    </div>
  );
};

export default LikeDislike;
