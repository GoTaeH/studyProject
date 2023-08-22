// document.addEventListener("DOMContentLoaded", () => {
//     fetch("/api/userEmail")
//         .then(response => response.json())
//         .then(data => {
//             if (data.error) {
//                 console.error("사용자 정보 가져오기 오류:", data.error);
//             } else {
//                 const userEmail = data.email;
//                 const welcomeDiv = document.querySelector(".welcomeuser");
//                 welcomeDiv.textContent = userEmail + "님의 즐겨찾기 목록";
                
//                 // 나머지 즐겨찾기 목록을 가져오는 코드
//             }
//         })
//         .catch(error => {
//             console.error("사용자 정보 가져오기 실패:", error);
//         });
// });
