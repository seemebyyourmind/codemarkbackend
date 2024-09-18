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
                  
              const Testcase= await ProblemService.UpdateTestCase(req.body.testcase_id,req.body.input,req.body.output);
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
const getLanguages = async (req, res) => {
  try {
    const languages = await ProblemService.getLanguages();
    return res.status(200).json({ languages });
  } catch (e) {
    return res.status(400).json({ error: "Không thể lấy danh sách ngôn ngữ lập trình", details: e });
  }
};


const CreateProblem = async (req, res) => {
  try {
    const { title, description, difficulty, testcases, problemDetails } = req.body;
    const result = await ProblemService.CreateProblem(title, description, difficulty, testcases, problemDetails);
    return res.status(200).json({ message: "Tạo bài toán thành công", problem_id: result.problemId });
  } catch (e) {
    return res.status(400).json({ error: "Không thể tạo bài toán", details: e.message });
  }
};
// Dữ liệu lỗi để test CreateProblem
const testDataCreateProblemError = {
  "title": "test loi", 
  "description": "Mô tả bài toán test lỗi", 
  "difficulty": "hard", 
  "testcases": [
    {
      "input": "2 3",
    "output": "5"
    },
    {
      "input": "-1 5",
       "output": "5"
    }
  ],
  "problemDetails": [
    {
      "language_id": "không phải số", 
      "source_code": "", 
      "time_ex": -1, 
      "memory": "128MB" 
    },
    {
    
    }
  ]
};

// Dữ liệu lỗi để test updateProblemInfo
const testDataUpdateProblemInfoError = {
  "problem_id": "không phải số", // ID không hợp lệ
  "title": 12345, // Tiêu đề không phải chuỗi
  "description": null, // Mô tả không hợp lệ
  "difficulty": [] // Độ khó không hợp lệ
};

// Dữ liệu lỗi để test updateProblemDetail
const testDataUpdateProblemDetailError = {
  "problem_id": -1, // ID không hợp lệ
  "language_id": "javascript", // language_id không hợp lệ
  "source_code": 12345, // Source code không phải chuỗi
  "time_ex": "1 giây", // Thời gian thực thi không hợp lệ
  "memory": true // Memory không hợp lệ
};

// JSON để test CreateProblem

const testDataCreateProblem = {
  "title": "Tổng hai số",
  "description": "Viết chương trình tính tổng hai số nguyên",
  "difficulty": "Dễ",
  "testcases": [
    {
      "input": "2 3",
      "output": "5"
    },
    {
      "input": "-1 5",
      "output": "4"
    }
  ],
  "problemDetails": [
    {
      "language_id": 1,
      "source_code": "def sum_two_numbers(a, b):\n    return a + b\n\na, b = map(int, input().split())\nprint(sum_two_numbers(a, b))",
      "time_ex": 1,
      "memory": 128
    },
    {
      "language_id": 2,
      "source_code": "#include <iostream>\nusing namespace std;\n\nint main() {\n    int a, b;\n    cin >> a >> b;\n    cout << a + b << endl;\n    return 0;\n}",
      "time_ex": 1,
      "memory": 256
    }
  ]
};

          
              


module.exports={getLanguages,CreateProblem,getSubmitsByProblemId,updateProblemDetail,updateProblemInfo,deleteProblem,getSearchProblem,getProblemInfo,UpdateTestCase,DeleteTestCase,CreateTestCase}