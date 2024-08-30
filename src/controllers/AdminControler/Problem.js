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
              
      



module.exports={getSearchProblem,getProblemInfo,UpdateTestCase,DeleteTestCase,CreateTestCase}