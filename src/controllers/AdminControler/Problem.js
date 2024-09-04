const ProblemService=require("../../services/admin/ProblemService")

//timf kiem problem theo 
const getSearchProblem = async (req, res) => {
    try {
     
      const page = parseInt(req.query.page, 10) || 1;
      const difficulty = req.query.difficulty || 'all';
      const search = req.query.search || '';
    
      
    //   const problems = await ProblemService.getSearchProblem(1,'all','h');
  
      const problems = await ProblemService.getSearchProblem(page,difficulty,search);
  
  
      //Tạo tài khoản
      return res.status(200).json({problems});
    } catch (e) {
      
      return res.status(404).json({e});
      }
    };

 const getProblemInfo = async (req, res) => {
        try {
         
          
        //   const problems = await ProblemService.getSearchProblem(1,'all','h');
      
          const ProblemInfo = await ProblemService.getProblemInfo(req.query.id);
          const ProblemDetail = await ProblemService.getProblemDetail(req.query.id);

          
          const Testcase= await ProblemService.getProblemTestCase(req.query.id);
          //Tạo tài khoản
          return res.status(200).json({ProblemInfo,ProblemDetail,Testcase});
        } catch (e) {
          
          return res.status(404).json({e});
          }
};
const DeleteTestCase = async (req, res) => {
          try {
           
            
          //   const problems = await ProblemService.getSearchProblem(1,'all','h');
        
            
            
            const Testcase= await ProblemService.DeleteTestCase(req.body.testcase_id);
            //Tạo tài khoản
            return res.status(200).json({Testcase});
          } catch (e) {
            
            return res.status(404).json({e});
            }
   };


const UpdateTestCase = async (req, res) => {
            try {
             
              
            //   const problems = await ProblemService.getSearchProblem(1,'all','h');
          
             
    
              
              const Testcase= await ProblemService.UpdateTestCase(req.body.testcase_id,req.body.output,req.body.input);
              //Tạo tài khoản
              return res.status(200).json({Testcase});
            } catch (e) {
              
              return res.status(404).json({e});
              }
};
const CreateTestCase = async (req, res) => {
        try {
                    
         const testcase_id= await ProblemService.CreateTestCase(req.body.problem_id,req.body.input,req.body.output);
                //Tạo tài khoản
                return res.status(200).json({testcase_id});
              } catch (e) {
                
                return res.status(404).json({e});
                }
 };

const deleteProblem = async (req, res) => {
  try {
    const problem_id = req.query.id;
    const result = await ProblemService.deleteProblem(problem_id);
    return res.status(200).json({ message: result });
  } catch (e) {
    return res.status(400).json({ error: e });
  }
};

const updateProblemInfo = async (req, res) => {
  try {
    const { problem_id, title, description, difficulty } = req.body;
    const result = await ProblemService.updateProblemInfo(problem_id, title, description, difficulty);
    return res.status(200).json({ message: result });
  } catch (e) {
    return res.status(400).json({ error: e });
  }
};

const updateProblemDetail = async (req, res) => {
  try {
    const { problem_id, language_id, source_code, time_ex, memory } = req.body;
    const result = await ProblemService.updateProblemDetail(problem_id, language_id, source_code, time_ex, memory);
    return res.status(200).json({ message: result });
  } catch (e) {
    return res.status(400).json({ error: e });
  }
};
const getSubmitsByProblemId = async (req, res) => {
  try {
    const problem_id = req.query.id;
    const page = req.query.page || 1;
    const submits = await ProblemService.getSubmitsByProblemId(problem_id, page);
    return res.status(200).json({ submits });
  } catch (e) {
    return res.status(400).json({ error: e });
  }
};


          
              
      



module.exports={getSubmitsByProblemId,updateProblemDetail,updateProblemInfo,deleteProblem,getSearchProblem,getProblemInfo,UpdateTestCase,DeleteTestCase,CreateTestCase}