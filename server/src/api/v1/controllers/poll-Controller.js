import { getIO } from "../../../loaders/socket-loader.js";
import Poll from "../../../models/Poll.js";

// create poll(admin only)
export const createPoll = async(req,res) => {
  try{
    const{question, options} = req.body;

    if(!question || !options || options.length < 2){
      return res.status(400).json({message:"Invalid poll data Poll must have question + 2 options minimum"});
    }

    const poll = await Poll.create({
      question,
      options,
      createdBy: req.user._id,
    });
    res.status(201).json(poll);

  }catch(err){
    res.status(500).json({message:"Error creating poll"});
  }
};

// get all polls
export const getPolls = async(req,res)=>{
  try{
    const polls = await Poll.find().sort({createdAt:-1});
    res.json(polls);
  }catch(err){
    res.status(500).json({message:"Error fetching polls"});
  }
};

// vote on Poll(main logic)
export const votePoll = async(req,res) => {
  try{
    const pollId = req.params.id;
    const {optionId} = req.body;
    const userId = req.user._id;

    const poll = await Poll.findById(pollId);
    if(!poll){
      return res.status(404).json({message:"Poll not found"});
    }

    if(!poll.isActive){
      return res.status(400).json({message:"Poll is closed"});
    }

    // admin cannot vote
    if(req.user.role === "admin"){
      return res.status(403).json({message:"Admin cannot vote"});
    }

    // already voted
    if(poll.voters.includes(userId)){
      return res.status(404).json({message:"You have already voted"});
    }

    // find the option by optionId
    const option = poll.options.id(optionId);
    if(!option){
      return res.status(400).json({message:"Invalid option"});
    }

    option.votes +=1; //increment vote
    poll.voters.push(userId); //mark user as voted

    await poll.save();

    // real-time update
    const io = getIO();
    io.emit("pollUpdated", poll);

    res.status(200).json({ //json
      message:"Vote counted", 
      poll,
    }); 
   
        // record vote
    poll.options[optionId].votes += 1;
    poll.voters.push(userId);

  } catch(err){
    console.error(err); 
    res.status(500).json({message:"Voting failed"});
  }
};

// delete poll(admin)
export const deletePoll = async(req, res) => {
  try{
    const pollId = req.params.id;
    const poll = await Poll.findByIdAndDelete(pollId);

    if(!poll){
      return res.status(404).json({message:"Poll not found"});
    }
    res.json({message:"Poll deleted"});
  } catch(err){
    res.status(500).json({message:"Delete failed"});
  }
};

// close poll
export const closePoll = async(req,res)=>{
  try{
    const poll = await Poll.findById(req.params.id);

    if(!poll){
      return res.status(404).json({message:"Poll not found"});
    }
    poll.isActive = false;
    await poll.save();
    res.json({message:"Poll closed", poll});
  }catch(err){
    res.status(500).json({message:"Error closing poll"});
  }
};














