
      // Global Variables
      let currentQuestion = 0;
      let testAnswers = [];
      let userProfile = {};
      let currentSection = "home";

      // Sample test questions
      const testQuestions = [
        {
          type: "Logical Reasoning",
          question: "Which number comes next in the sequence: 2, 4, 8, 16, ?",
          options: ["A) 24", "B) 32", "C) 20", "D) 28"],
          correct: "B",
        },
        {
          type: "Verbal Ability",
          question:
            "Choose the word that best completes the sentence: The scientist's _____ approach led to breakthrough discoveries.",
          options: ["A) methodical", "B) careless", "C) rushed", "D) random"],
          correct: "A",
        },
        {
          type: "Numerical Ability",
          question: "If 3x + 7 = 22, what is the value of x?",
          options: ["A) 3", "B) 5", "C) 7", "D) 9"],
          correct: "B",
        },
        {
          type: "Personality",
          question: "When working on a group project, you prefer to:",
          options: [
            "A) Lead and organize the team",
            "B) Contribute ideas and support others",
            "C) Focus on detailed analysis",
            "D) Ensure everyone gets along",
          ],
          correct: "A",
        },
        {
          type: "Logical Reasoning",
          question:
            "All roses are flowers. Some flowers fade quickly. Therefore:",
          options: [
            "A) All roses fade quickly",
            "B) Some roses may fade quickly",
            "C) No roses fade quickly",
            "D) Cannot be determined",
          ],
          correct: "B",
        },
      ];

      // Navigation Functions
      function showSection(sectionId) {
        // Hide all sections
        document.querySelectorAll(".section").forEach((section) => {
          section.classList.remove("active");
        });

        // Show selected section
        document.getElementById(sectionId).classList.add("active");

        // Update navigation
        document.querySelectorAll(".nav-link").forEach((link) => {
          link.classList.remove("active");
        });
        event.target.classList.add("active");

        currentSection = sectionId;

        // Initialize section-specific functionality
        if (sectionId === "dashboard") {
          initializeSkillsChart();
        }
      }

      // Profile Functions
      function saveProfile() {
        const profile = {
          name: document.getElementById("name").value,
          age: document.getElementById("age").value,
          location: document.getElementById("location").value,
          education: document.getElementById("education").value,
          interests: document.getElementById("interests").value,
          budget: document.getElementById("budget").value,
          subjects: Array.from(
            document.querySelectorAll('input[type="checkbox"]:checked')
          ).map((cb) => cb.value),
          countries: Array.from(
            document.querySelectorAll(
              '#countries input[type="checkbox"]:checked'
            )
          ).map((cb) => cb.value),
        };

        userProfile = profile;
        alert(
          "Profile saved successfully! You can now take the aptitude test."
        );
        showSection("test");
      }

      // Test Functions
      function startTest() {
        document.getElementById("test-intro").classList.add("hidden");
        document.getElementById("test-interface").classList.remove("hidden");
        loadQuestion();
      }

      function loadQuestion() {
        if (currentQuestion >= testQuestions.length) {
          finishTest();
          return;
        }

        const question = testQuestions[currentQuestion];
        document.getElementById("question-counter").textContent = `Question ${
          currentQuestion + 1
        } of ${testQuestions.length}`;
        document.getElementById("test-type").textContent = question.type;
        document.getElementById("question-text").textContent =
          question.question;

        const optionsContainer = document.querySelector(".options");
        optionsContainer.innerHTML = "";

        question.options.forEach((option, index) => {
          const optionDiv = document.createElement("div");
          optionDiv.className = "option";
          optionDiv.textContent = option;
          optionDiv.onclick = () => selectOption(optionDiv, option.charAt(0));
          optionsContainer.appendChild(optionDiv);
        });

        // Update progress bar
        const progress = ((currentQuestion + 1) / testQuestions.length) * 100;
        document.getElementById("progress-fill").style.width = progress + "%";

        // Update button states
        document.getElementById("prev-btn").disabled = currentQuestion === 0;
        document.getElementById("next-btn").textContent =
          currentQuestion === testQuestions.length - 1 ? "Finish Test" : "Next";
      }

      function selectOption(element, value) {
        // Remove previous selections
        document
          .querySelectorAll(".option")
          .forEach((opt) => opt.classList.remove("selected"));
        element.classList.add("selected");

        // Store answer
        testAnswers[currentQuestion] = value;
      }

      function nextQuestion() {
        if (!testAnswers[currentQuestion]) {
          alert("Please select an answer before proceeding.");
          return;
        }

        currentQuestion++;
        loadQuestion();
      }

      function previousQuestion() {
        if (currentQuestion > 0) {
          currentQuestion--;
          loadQuestion();
        }
      }

      function finishTest() {
        document.getElementById("test-interface").classList.add("hidden");
        document.getElementById("test-results").classList.remove("hidden");

        // Here you would normally process the answers and calculate real scores
        // For demo purposes, we're showing static results
      }

      // College Filter Functions
      function filterColleges(filter) {
        const collegeCards = document.querySelectorAll(".college-card");
        const filterButtons = {
          all: document.getElementById("filter-all"),
          local: document.getElementById("filter-local"),
          international: document.getElementById("filter-international"),
        };

        // Reset button styles
        Object.values(filterButtons).forEach((btn) => {
          btn.className = "btn-secondary";
        });
        filterButtons[filter].className = "btn";

        // Show/hide colleges
        collegeCards.forEach((card) => {
          if (filter === "all") {
            card.style.display = "block";
          } else {
            card.style.display = card.classList.contains(filter)
              ? "block"
              : "none";
          }
        });
      }

      // Chat Functions
      async function sendMessage() {
        const input = document.getElementById("chat-input");
        const message = input.value.trim();

        if (message) {
          addMessage("user", message);
          input.value = "";

          const aiResponse = await generateAIResponse(message);
          addMessage("bot", aiResponse[0]);
        }
      }

      function addMessage(sender, message) {
        const messagesContainer = document.getElementById("chat-messages");
        const messageDiv = document.createElement("div");
        messageDiv.className = `message ${sender}`;

        if (sender === "bot") {
          messageDiv.innerHTML = `<strong>AI Career Mentor:</strong> ${message}`;
        } else {
          messageDiv.innerHTML = `<strong>You:</strong> ${message}`;
        }

        messagesContainer.appendChild(messageDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
      }

      async function generateAIResponse(userMessage) {
        // Simple response generation based on keywords
        const message = userMessage.toLowerCase();

        const url =
          "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent"; // Replace with your API endpoint
        const data = {
          contents: [
            {
              parts: [
                {
                  text: message,
                },
              ],
            },
          ],
        };

        return await fetch(url, {
          method: "POST", // Specify the HTTP method as POST
          headers: {
            "Content-Type": "application/json", // Indicate the body content type
            "X-goog-api-key": "AIzaSyBhtC7W8J72fJ_mFT8RS_mWUaVtAaUBnKY",
          },
          body: JSON.stringify(data), // Convert the JavaScript object to a JSON string
        })
          .then((response) => {
            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json(); // Parse the JSON response body
          })
          .then((responseData) => {
            const responseParts =
              responseData.candidates?.[0]?.content.parts?.map((part) => {
                return part.text;
              });

            console.log("Success:", responseParts);
            return responseParts;
          })
          .catch((error) => {
            console.error("Error:", error);
          });

        // if (message.includes("career") || message.includes("job")) {
        //   return "Based on your test results, I recommend focusing on Software Engineering or Data Science. These fields align perfectly with your analytical skills and interests. Would you like me to provide a detailed roadmap for either of these careers?";
        // } else if (
        //   message.includes("college") ||
        //   message.includes("university")
        // ) {
        //   return "For your profile and budget, I'd recommend looking at IIT Delhi for local options and University of Toronto for international studies. Both have excellent programs in your areas of interest. Would you like help with application requirements?";
        // } else if (message.includes("study") || message.includes("prepare")) {
        //   return "Here's a personalized study plan: 1) Focus on strengthening your mathematical foundations, 2) Learn programming languages like Python and Java, 3) Build projects to showcase your skills, 4) Prepare for entrance exams like JEE or SAT. Would you like detailed resources for any of these areas?";
        // } else if (message.includes("salary") || message.includes("money")) {
        //   return "Software Engineers typically earn $75,000-$150,000 annually, while Data Scientists can earn $85,000-$165,000. In India, these ranges translate to ₹12-25 lakhs and ₹15-30 lakhs respectively. These are growing fields with excellent career prospects!";
        // } else {
        //   return "That's a great question! Based on your profile and test results, I can provide personalized guidance. Could you be more specific about what aspect of your career journey you'd like to discuss - whether it's about specific careers, college applications, skill development, or something else?";
        // }
      }

      function askPredefinedQuestion(type) {
        const questions = {
          "career-change":
            "I want to explore different career options. Can you help me understand which careers best match my skills?",
          "study-plan":
            "Can you create a personalized study plan to help me achieve my career goals?",
          "college-prep":
            "What should I do to prepare for college applications?",
          "interview-prep":
            "How can I prepare for job interviews in the tech industry?",
          "skill-gap":
            "What skills am I missing for my target career, and how can I develop them?",
        };

        const question = questions[type];
        document.getElementById("chat-input").value = question;
        sendMessage();
      }

      function handleChatEnter(event) {
        if (event.key === "Enter") {
          sendMessage();
        }
      }

      // Dashboard Functions
      function initializeSkillsChart() {
        const ctx = document.getElementById("skillsChart");
        if (!ctx) return;

        new Chart(ctx, {
          type: "radar",
          data: {
            labels: [
              "Logical Reasoning",
              "Verbal Ability",
              "Numerical Ability",
              "Technical Skills",
              "Communication",
              "Leadership",
            ],
            datasets: [
              {
                label: "Your Skills",
                data: [85, 78, 92, 88, 75, 70],
                backgroundColor: "rgba(102, 126, 234, 0.2)",
                borderColor: "#667eea",
                borderWidth: 2,
                pointBackgroundColor: "#667eea",
                pointBorderColor: "#fff",
                pointHoverBackgroundColor: "#fff",
                pointHoverBorderColor: "#667eea",
              },
            ],
          },
          options: {
            responsive: true,
            scales: {
              r: {
                beginAtZero: true,
                max: 100,
                grid: {
                  color: "rgba(0,0,0,0.1)",
                },
                pointLabels: {
                  font: {
                    size: 12,
                  },
                },
              },
            },
            plugins: {
              legend: {
                position: "bottom",
              },
            },
          },
        });
      }

      // Initialize the app
      document.addEventListener("DOMContentLoaded", function () {
        // Set default filter for colleges
        filterColleges("all");

        // Initialize any default functionality
        console.log("AI Career Mentor Platform Loaded Successfully!");
      });
    