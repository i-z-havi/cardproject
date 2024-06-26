import { Box, CardActions, IconButton, Button } from "@mui/material";
import React from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import CallIcon from "@mui/icons-material/Call";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { func, string } from "prop-types";
import { useUser } from "../../../users/providers/UserProvider";
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { useState } from "react";

export default function CardActionBar({
  id,
  userid,
  handleDelete,
  handleLike,
  handleEdit,
  isLiked,
  phone
}) {
  
  const [open, setOpen] = useState(false);
  const {user}=useUser();
  const [liked, setLiked]=useState(
    ()=>{if (!user) return false;
    return isLiked;
    }
  );
  const displayEdit=()=>{
  if(!!user){
    if ((String(userid)===String(user.id))||user.isAdmin) {
      return true
    }
  }
    return false
  }

  const likeCard=(id)=>{
    setLiked((prev)=>!prev);
    handleLike(id,liked);
  }

  const handleClickOpen = () => {
    console.log("test")
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <CardActions sx={{ justifyContent: "space-between" }}>
        <Box>
          {displayEdit()?
          <Box>
          <IconButton aria-label="Edit Card" onClick={() => handleEdit(id)}>
           <ModeEditIcon />
          </IconButton>
          <IconButton aria-label="Delete Card" onClick={() => handleClickOpen()}>
            <DeleteIcon />
          </IconButton>
          </Box>
          :null
        }
        </Box>
        <Box>
          <a href={"tel:"+phone}>
          <IconButton aria-label="Call">
            <CallIcon />
          </IconButton>
          </a>
          {user&& <IconButton aria-label="Add to favorite" onClick={() => likeCard(id)}>
            <FavoriteIcon color={liked?"error":"inherit"} />
          </IconButton>
        }
        </Box>
      </CardActions>

      
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Delete Card?"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Delete the card? This can not be undone!
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} autoFocus>Disagree</Button>
          <Button onClick={()=>handleDelete(id)} >
            Agree
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

CardActionBar.propTypes = {
  id: string.isRequired,
  handleDelete: func,
  handleLike: func,
  handleEdit: func,
};
