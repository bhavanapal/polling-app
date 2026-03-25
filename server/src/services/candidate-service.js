// import Candidate from '../models/candidate.js';

import User from "../models/user";


/***
 * Get a User by Role
 * @param {String} id - User ID
 * @returns {Promise<Object>}
 */

const getUserByRole = async (id) => {
    try{
        const user = await User.findById(id).lean();
        return user.role === 'admin';
    }catch(err){
        return false;
    }   
};

export default getUserByRole;