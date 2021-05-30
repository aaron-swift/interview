///////////
// Frontend: Phone input
///////////
//
// Implement a React input component with the following properties:
//
// 1. User entry should be formatted as a US phone number
//    "5085172534" => "(508) 517-2534"
//
// 2. Formatting characters should inserted incrementally
//    **preceding** the final digit
//   "" => ""
//   "5" => "(5"
//   "50" => "(50"
//   "508" => "(508"
//   "5085" => "(508) 5"
//
// 3. Formatting characters should be deleted incrementally
//   **succeeding* the final digit
//   "5085" => "(508) 5"
//   "508" => "(508"
//   "50" => "(50"
//   "5" => "(5"
//   "" => ""
//
// 4. Pasting a full or partial number should format the same way
