import { MongoClient, ObjectId } from "mongodb";

const VIDEO_URL = "https://s3.toosio.com/t/pathshala/videoplayback.mp4";

const lesson = (topicName, summary, keyPoints, durationMinutes = 12) => ({
  topicName,
  topicLink: VIDEO_URL,
  summary,
  keyPoints,
  durationMinutes,
});
const question = (prompt, options, correctOption, explanation) => ({
  prompt,
  options,
  correctOption,
  explanation,
});

const content = {
  "Learn Python Programming": {
    duration: "8 weeks • Self-paced",
    description:
      "Build a dependable Python foundation, solve problems with core data structures, work with files and errors, and progress into object-oriented and practical application design.",
    syllabus: [
      {
        chapter: "Python Foundations",
        topics: [
          lesson(
            "How Python Programs Work",
            "Understand how Python source code is interpreted, how statements are executed, and how to use the REPL and script files. This lesson also establishes a repeatable edit-run-debug workflow.",
            [
              "Interpreter, REPL, and script modes",
              "Statements, expressions, and comments",
              "Reading tracebacks instead of guessing",
            ],
            14,
          ),
          lesson(
            "Variables, Values, and Types",
            "Learn how names reference values and how Python represents integers, floats, strings, booleans, and None. You will practice inspecting and converting types safely.",
            [
              "Dynamic typing and assignment",
              "type(), isinstance(), and conversion",
              "Naming conventions and meaningful variables",
            ],
            15,
          ),
          lesson(
            "Operators and Expressions",
            "Combine values with arithmetic, comparison, logical, membership, and identity operators. Focus on precedence and on writing expressions that communicate intent.",
            [
              "Arithmetic and comparison operators",
              "Boolean short-circuiting",
              "Precedence and parentheses",
            ],
            14,
          ),
          lesson(
            "Input, Output, and String Formatting",
            "Accept user input, validate basic values, and present readable output with f-strings. Learn the difference between data representation and display formatting.",
            [
              "input() always returns text",
              "f-strings and format specifiers",
              "Converting and validating input",
            ],
            13,
          ),
        ],
      },
      {
        chapter: "Control Flow and Functions",
        topics: [
          lesson(
            "Decisions with Conditionals",
            "Model decisions with if, elif, and else while avoiding deeply nested logic. Translate business rules into clear boolean conditions.",
            [
              "Truthiness and comparisons",
              "Mutually exclusive branches",
              "Guard clauses for simpler code",
            ],
            15,
          ),
          lesson(
            "Iteration with for and while",
            "Use for loops for finite collections and while loops for condition-driven repetition. Apply range, enumerate, break, and continue deliberately.",
            [
              "Choosing for versus while",
              "range() and enumerate()",
              "Loop control and infinite-loop prevention",
            ],
            17,
          ),
          lesson(
            "Writing Reusable Functions",
            "Define focused functions with parameters and return values. Learn local scope, default arguments, and why pure functions are easier to test.",
            [
              "Parameters versus arguments",
              "Return values and early returns",
              "Local scope and function contracts",
            ],
            18,
          ),
          lesson(
            "Comprehensions and Generator Expressions",
            "Transform and filter sequences concisely without sacrificing readability. Compare eager list comprehensions with memory-efficient generator expressions.",
            [
              "Map-and-filter structure",
              "Nested comprehension readability",
              "Lazy generator evaluation",
            ],
            15,
          ),
        ],
      },
      {
        chapter: "Core Data Structures",
        topics: [
          lesson(
            "Lists and Tuples",
            "Store ordered collections, access them with indexing and slicing, and choose between mutable lists and immutable tuples. Practice common sequence operations.",
            [
              "Indexing, slicing, and unpacking",
              "List mutation methods",
              "When immutability helps",
            ],
            18,
          ),
          lesson(
            "Dictionaries and Sets",
            "Represent keyed records with dictionaries and unique collections with sets. Learn safe lookup, iteration patterns, and set algebra.",
            [
              "Keys, values, and safe lookup",
              "Dictionary iteration",
              "Union, intersection, and difference",
            ],
            18,
          ),
          lesson(
            "Working with Strings",
            "Treat strings as immutable sequences and apply searching, splitting, joining, cleaning, and formatting techniques used in real data processing.",
            [
              "String immutability",
              "split(), join(), strip(), and replace()",
              "Case normalization and searching",
            ],
            16,
          ),
          lesson(
            "Choosing the Right Collection",
            "Compare lists, tuples, dictionaries, and sets by ordering, uniqueness, lookup needs, and mutability. Use small modeling exercises to make intentional choices.",
            [
              "Sequence versus mapping",
              "Membership performance",
              "Modeling records and relationships",
            ],
            14,
          ),
        ],
      },
      {
        chapter: "Reliable Python Programs",
        topics: [
          lesson(
            "Files and Context Managers",
            "Read and write text and JSON files safely using with blocks. Understand paths, encodings, and why resources must be closed reliably.",
            [
              "with open(...) resource safety",
              "Text modes and UTF-8",
              "JSON serialization basics",
            ],
            18,
          ),
          lesson(
            "Exceptions and Validation",
            "Handle expected failures without hiding programming errors. Raise meaningful exceptions and validate at system boundaries.",
            [
              "try, except, else, and finally",
              "Specific exception types",
              "Raising errors with useful messages",
            ],
            18,
          ),
          lesson(
            "Modules, Packages, and Environments",
            "Organize code across modules, understand imports, and isolate dependencies with virtual environments. Learn what makes a module executable or reusable.",
            [
              "Import resolution and __name__",
              "Package structure",
              "Virtual environments and dependencies",
            ],
            17,
          ),
          lesson(
            "Testing and Debugging",
            "Write small tests, isolate failures, and debug systematically with assertions, breakpoints, and focused reproduction cases.",
            [
              "Arrange, act, assert",
              "Boundary and failure cases",
              "Debugger-driven investigation",
            ],
            18,
          ),
        ],
      },
      {
        chapter: "Intermediate Python Design",
        topics: [
          lesson(
            "Classes and Objects",
            "Model related state and behavior with classes while keeping responsibilities narrow. Use constructors, instance methods, and readable representations.",
            [
              "Instances, attributes, and methods",
              "__init__ and __repr__",
              "Encapsulation over global state",
            ],
            20,
          ),
          lesson(
            "Inheritance and Composition",
            "Reuse behavior without creating fragile hierarchies. Compare inheritance with composition and use polymorphism through shared interfaces.",
            [
              "Is-a versus has-a relationships",
              "Method overriding",
              "Favoring composition for flexibility",
            ],
            18,
          ),
          lesson(
            "Iterators, Decorators, and Useful Protocols",
            "Recognize Python's protocol-based design and build simple iterators and decorators. Connect dunder methods to familiar language behavior.",
            [
              "Iterable and iterator protocols",
              "Functions as first-class values",
              "Decorator wrappers and metadata",
            ],
            20,
          ),
          lesson(
            "Building a Small Command-Line Application",
            "Bring the course together by structuring a small data-driven CLI with validation, persistence, tests, and clear separation of concerns.",
            [
              "Separating input, logic, and storage",
              "Incremental feature delivery",
              "Testing the core independently of the UI",
            ],
            24,
          ),
        ],
      },
    ],
    finalAssessment: {
      title: "Python Programming Final Assessment",
      durationMinutes: 45,
      passingScore: 70,
      questions: [
        question(
          "What does Python's dynamic typing mean?",
          [
            "Variables can reference values of different types over time",
            "Every value changes type automatically",
            "Types are checked only by an IDE",
            "Variables have no type-related behavior",
          ],
          0,
          "Names are not permanently declared with one type; values themselves still have types.",
        ),
        question(
          "Which expression is false?",
          ["bool(1)", "bool('0')", "bool([])", "bool({'x': 1})"],
          2,
          "An empty collection is falsy; non-empty strings and collections are truthy.",
        ),
        question(
          "Why prefer an f-string for formatted output?",
          [
            "It encrypts the value",
            "It keeps expressions close to their placeholders",
            "It converts every value to an integer",
            "It changes the stored value",
          ],
          1,
          "F-strings make interpolation direct and readable.",
        ),
        question(
          "When is a while loop usually the clearest choice?",
          [
            "When iterating every item in a known list",
            "When repetition continues until a condition changes",
            "When defining a class",
            "When importing a module",
          ],
          1,
          "while expresses condition-controlled repetition.",
        ),
        question(
          "What is the effect of return inside a function?",
          [
            "It prints a value only",
            "It ends the function and sends a value to the caller",
            "It restarts the function",
            "It creates a global variable",
          ],
          1,
          "return ends the current call and optionally provides a result.",
        ),
        question(
          "Which collection best stores unique tags with fast membership checks?",
          ["List", "Tuple", "Set", "String"],
          2,
          "Sets enforce uniqueness and are designed for membership operations.",
        ),
        question(
          "Which dictionary access avoids KeyError for a missing key?",
          [
            "record['missing']",
            "record.get('missing')",
            "record.missing",
            "record::missing",
          ],
          1,
          "get returns None or a supplied default when the key is absent.",
        ),
        question(
          "Why can a tuple be safer than a list for a fixed coordinate?",
          [
            "Tuples are always faster",
            "Tuples cannot be iterated",
            "Its immutability prevents accidental element changes",
            "It accepts only numbers",
          ],
          2,
          "Immutability communicates and enforces a fixed value collection.",
        ),
        question(
          "What does ' '.join(words) do?",
          [
            "Splits one string",
            "Combines strings with spaces",
            "Sorts the strings",
            "Removes every space",
          ],
          1,
          "join combines iterable string elements using the separator.",
        ),
        question(
          "What is the main benefit of a generator expression?",
          [
            "It evaluates items lazily",
            "It always returns a list",
            "It bypasses all loops",
            "It stores duplicate variables",
          ],
          0,
          "Generators produce values on demand and can reduce memory use.",
        ),
        question(
          "Why use with open(path) as file?",
          [
            "It makes the file public",
            "It ensures the file is closed even if an error occurs",
            "It prevents reading",
            "It converts the file to JSON",
          ],
          1,
          "A context manager guarantees predictable resource cleanup.",
        ),
        question(
          "Which exception-handling practice is strongest?",
          [
            "Catch every error with bare except",
            "Ignore every exception",
            "Catch the specific expected exception",
            "Use exceptions instead of conditionals everywhere",
          ],
          2,
          "Specific catches handle expected failures without masking unrelated bugs.",
        ),
        question(
          "What does if __name__ == '__main__' protect?",
          [
            "Code intended to run only when the file is executed directly",
            "All imported names",
            "The Python installation",
            "Private class fields",
          ],
          0,
          "Imported modules get their module name; directly executed files use __main__.",
        ),
        question(
          "What makes a unit test valuable?",
          [
            "It depends on many external systems",
            "It tests one behavior with a clear expected result",
            "It only prints output",
            "It can never fail",
          ],
          1,
          "Focused, deterministic tests make failures understandable.",
        ),
        question(
          "What is an instance method's conventional first parameter?",
          ["class", "this", "self", "object"],
          2,
          "self receives the instance on which the method was called.",
        ),
        question(
          "Composition models which relationship?",
          ["Has-a", "Is-always-a", "Runs-before", "Imports-from"],
          0,
          "Composition builds an object from collaborating objects it has.",
        ),
        question(
          "What must __iter__ normally return?",
          ["A boolean", "An iterator", "A file path", "A class name"],
          1,
          "The iterable protocol asks __iter__ for an iterator.",
        ),
        question(
          "A decorator commonly does what?",
          [
            "Wraps a callable to extend behavior",
            "Deletes all parameters",
            "Converts Python to JavaScript",
            "Creates a database automatically",
          ],
          0,
          "Decorators receive a callable and return a replacement callable.",
        ),
        question(
          "Where should input validation usually happen?",
          [
            "Only after data is saved",
            "At system boundaries before core logic relies on it",
            "Nowhere in a typed program",
            "Inside every print statement",
          ],
          1,
          "Boundary validation protects the trusted core of the program.",
        ),
        question(
          "Which structure best supports testable CLI code?",
          [
            "Mix input, storage, and rules in one loop",
            "Keep business logic separate from terminal input/output",
            "Use only global variables",
            "Catch and discard every exception",
          ],
          1,
          "Separating pure logic from I/O makes behavior reusable and easy to test.",
        ),
      ],
    },
  },
  "Master UX/UI Design": {
    duration: "8 weeks • Self-paced",
    description:
      "Learn an evidence-led UX/UI process from research and information architecture through accessible visual systems, prototyping, usability testing, and portfolio-ready delivery.",
    syllabus: [
      {
        chapter: "Design Foundations",
        topics: [
          lesson(
            "UX, UI, and Product Thinking",
            "Separate user experience from interface styling and connect both to product outcomes. Frame design as a process of reducing user problems while meeting business constraints.",
            [
              "UX versus UI responsibilities",
              "User value and business value",
              "Outcome-focused design decisions",
            ],
            15,
          ),
          lesson(
            "Human-Centered Design Process",
            "Move from discovery through definition, exploration, prototyping, and evaluation. Understand that real design work is iterative rather than a one-way handoff.",
            [
              "Discover, define, develop, deliver",
              "Divergent and convergent thinking",
              "Iteration based on evidence",
            ],
            16,
          ),
          lesson(
            "Visual Hierarchy and Gestalt Principles",
            "Guide attention with size, contrast, proximity, alignment, and grouping. Apply Gestalt principles to make relationships understandable before a user reads every label.",
            [
              "Hierarchy and scan paths",
              "Proximity, similarity, and continuity",
              "Reducing visual ambiguity",
            ],
            18,
          ),
          lesson(
            "Design Critique and Problem Framing",
            "Write useful problem statements and evaluate work against goals instead of personal taste. Give specific critique that links observations to user impact.",
            [
              "How-might-we framing",
              "Objective critique language",
              "Separating observations from solutions",
            ],
            15,
          ),
        ],
      },
      {
        chapter: "User Research and Structure",
        topics: [
          lesson(
            "Research Planning and Ethics",
            "Choose research methods based on the decision you need to make. Recruit responsibly, gain consent, avoid leading prompts, and protect participant data.",
            [
              "Research questions versus interview questions",
              "Consent and privacy",
              "Sampling limitations",
            ],
            18,
          ),
          lesson(
            "User Interviews and Observation",
            "Conduct interviews that uncover behaviors, motivations, and constraints. Use follow-up prompts and observation instead of asking participants to predict future behavior.",
            [
              "Open-ended prompts",
              "Critical incidents and past behavior",
              "Neutral facilitation",
            ],
            20,
          ),
          lesson(
            "Synthesis, Personas, and Journey Maps",
            "Turn raw notes into patterns, needs, and opportunity areas. Create lightweight artifacts only when they help a team make a decision.",
            [
              "Affinity mapping",
              "Evidence-based personas",
              "Journey stages, pain points, and opportunities",
            ],
            20,
          ),
          lesson(
            "Information Architecture and User Flows",
            "Organize content around user mental models and map the steps needed to complete important tasks. Identify decision points, alternate paths, and failure recovery.",
            [
              "Taxonomy and navigation",
              "Task flows versus user flows",
              "Happy paths and edge cases",
            ],
            20,
          ),
        ],
      },
      {
        chapter: "Interface Systems",
        topics: [
          lesson(
            "Typography for Interfaces",
            "Build a readable type scale and use weight, line length, spacing, and hierarchy consistently. Treat typography as core interface structure rather than decoration.",
            [
              "Type scale and semantic roles",
              "Readable line height and measure",
              "Contrast through size and weight",
            ],
            18,
          ),
          lesson(
            "Color, Contrast, and Meaning",
            "Create functional palettes with accessible contrast and avoid relying on color alone. Assign color roles that remain consistent across states and themes.",
            [
              "Semantic color tokens",
              "WCAG contrast intent",
              "Status communication beyond color",
            ],
            18,
          ),
          lesson(
            "Layout, Grids, and Responsive Design",
            "Create flexible layouts using spacing systems, grids, constraints, and content priorities. Design across breakpoints instead of shrinking a desktop canvas.",
            [
              "Spacing rhythm and alignment",
              "Fluid versus fixed behavior",
              "Mobile content prioritization",
            ],
            20,
          ),
          lesson(
            "Components and Design Tokens",
            "Build reusable components with documented states and use tokens for color, type, spacing, and elevation. Understand how systems improve quality and delivery speed.",
            [
              "Component anatomy and variants",
              "Tokens versus raw values",
              "Consistency with room for context",
            ],
            20,
          ),
        ],
      },
      {
        chapter: "Interaction and Prototyping",
        topics: [
          lesson(
            "Wireframing from Low to High Fidelity",
            "Choose fidelity based on the question being answered. Begin with structure and task flow before investing in polished visual details.",
            [
              "Fidelity as a decision tool",
              "Annotation and content realism",
              "Avoiding premature polish",
            ],
            18,
          ),
          lesson(
            "Interaction States and Feedback",
            "Design default, hover, focus, active, loading, empty, success, and error states. Make system status visible and help users recover when something fails.",
            [
              "Immediate and meaningful feedback",
              "Empty and loading states",
              "Error prevention and recovery",
            ],
            20,
          ),
          lesson(
            "Prototyping Meaningful Flows",
            "Connect screens into realistic task flows with appropriate transitions and interactions. Build only enough fidelity to test the riskiest assumptions.",
            [
              "Prototype scope and hypothesis",
              "Interaction hotspots",
              "Realistic data and content",
            ],
            20,
          ),
          lesson(
            "Accessible Interaction Design",
            "Design for keyboard, screen reader, motor, vision, and cognitive access. Use semantic patterns, visible focus, adequate targets, and clear language.",
            [
              "Keyboard order and focus visibility",
              "Labels and semantic controls",
              "Target size and reduced motion",
            ],
            22,
          ),
        ],
      },
      {
        chapter: "Validation and Delivery",
        topics: [
          lesson(
            "Usability Test Planning",
            "Define tasks, success criteria, participants, and a neutral facilitation guide. Test behavior on a prototype instead of asking whether people like it.",
            [
              "Task-based sessions",
              "Behavioral success measures",
              "Think-aloud facilitation",
            ],
            20,
          ),
          lesson(
            "Analyzing Findings and Prioritizing Fixes",
            "Separate observations from interpretations, identify recurring usability issues, and prioritize by severity, frequency, and product impact.",
            [
              "Evidence-backed findings",
              "Severity and frequency",
              "Recommendations tied to root causes",
            ],
            18,
          ),
          lesson(
            "Developer Handoff and Design QA",
            "Communicate behavior, states, responsive rules, and accessibility—not only static screens. Review implementation collaboratively and resolve discrepancies by impact.",
            [
              "Specs and interaction notes",
              "Reusable assets and tokens",
              "Design QA across states and breakpoints",
            ],
            18,
          ),
          lesson(
            "Case Studies and Portfolio Storytelling",
            "Present the problem, your role, evidence, decisions, iterations, and outcomes with honesty. Show how you think rather than filling a page with polished screens.",
            [
              "Context, constraints, and role",
              "Decision evidence and iteration",
              "Outcome and reflection",
            ],
            22,
          ),
        ],
      },
    ],
    finalAssessment: {
      title: "UX/UI Design Final Assessment",
      durationMinutes: 45,
      passingScore: 70,
      questions: [
        question(
          "What best distinguishes UX from UI?",
          [
            "UX concerns the whole experience; UI focuses on interface presentation and interaction",
            "UX is only research; UI is only coding",
            "They are unrelated disciplines",
            "UI always happens before UX",
          ],
          0,
          "UX spans the end-to-end experience while UI is the interface layer within it.",
        ),
        question(
          "Why is design iteration valuable?",
          [
            "It guarantees the first idea is used",
            "It incorporates evidence and reduces risk over repeated cycles",
            "It removes the need for research",
            "It prevents stakeholder feedback",
          ],
          1,
          "Iteration lets teams learn and improve before expensive delivery.",
        ),
        question(
          "Which principle explains why nearby items seem related?",
          ["Proximity", "Closure", "Symmetry", "Motion"],
          0,
          "Gestalt proximity causes close elements to be perceived as a group.",
        ),
        question(
          "A strong critique should primarily reference what?",
          [
            "The reviewer's taste",
            "The design goal and user impact",
            "Current fashion",
            "The designer's seniority",
          ],
          1,
          "Objective critique connects observations to intended outcomes.",
        ),
        question(
          "Which interview question is least leading?",
          [
            "Don't you find this checkout confusing?",
            "Would you use this every day?",
            "Tell me about the last time you paid a bill online",
            "You prefer the blue version, right?",
          ],
          2,
          "Past-behavior prompts elicit evidence without suggesting an answer.",
        ),
        question(
          "What is affinity mapping used for?",
          [
            "Choosing font licenses",
            "Grouping research observations into patterns",
            "Exporting CSS",
            "Calculating contrast ratios",
          ],
          1,
          "Affinity mapping supports qualitative synthesis.",
        ),
        question(
          "What should a user flow include beyond the happy path?",
          [
            "Only brand colors",
            "Decision points, errors, and recovery routes",
            "Employee biographies",
            "Final source code",
          ],
          1,
          "Real tasks include alternate and failure paths.",
        ),
        question(
          "What is a healthy body-text line length guideline intended to improve?",
          [
            "Readability",
            "Database performance",
            "Animation speed",
            "File compression",
          ],
          0,
          "Reasonable measure helps the eye track from one line to the next.",
        ),
        question(
          "Why should status not rely on color alone?",
          [
            "Color is expensive",
            "Some users cannot distinguish the color difference",
            "Text cannot be translated",
            "Icons are always mandatory",
          ],
          1,
          "A second cue makes meaning available regardless of color perception.",
        ),
        question(
          "What is the role of a design token?",
          [
            "Store a reusable semantic design decision",
            "Replace user testing",
            "Render a final video",
            "Generate personas automatically",
          ],
          0,
          "Tokens name reusable decisions such as color roles and spacing.",
        ),
        question(
          "When is low-fidelity wireframing most useful?",
          [
            "When exploring structure and flow cheaply",
            "Only after development",
            "For final color approval",
            "For measuring production performance",
          ],
          0,
          "Low fidelity keeps attention on structure and allows rapid change.",
        ),
        question(
          "Which state communicates that a request is still processing?",
          ["Empty", "Loading", "Hover", "Disabled forever"],
          1,
          "A loading state makes current system status visible.",
        ),
        question(
          "A prototype should be scoped around what?",
          [
            "Every imaginable screen",
            "The assumption or flow that needs validation",
            "Only the home page",
            "The maximum number of animations",
          ],
          1,
          "Purposeful prototypes are built to answer a question.",
        ),
        question(
          "What supports keyboard accessibility?",
          [
            "Removing outlines",
            "A logical focus order and visible focus indicator",
            "Hover-only controls",
            "Very small targets",
          ],
          1,
          "Keyboard users must locate and operate focused controls.",
        ),
        question(
          "What makes a usability-test task effective?",
          [
            "It tells the participant exactly where to click",
            "It states a realistic goal without revealing the solution",
            "It asks whether the UI is pretty",
            "It trains the participant first",
          ],
          1,
          "Goal-oriented tasks allow the design to be tested naturally.",
        ),
        question(
          "How should usability issues be prioritized?",
          [
            "Only by visual size",
            "By severity, frequency, and impact",
            "Alphabetically",
            "By who reported them",
          ],
          1,
          "Priority reflects how seriously and often an issue blocks outcomes.",
        ),
        question(
          "What belongs in a complete developer handoff?",
          [
            "Static screenshots only",
            "Behavior, states, responsive rules, assets, and accessibility notes",
            "Research recordings only",
            "A verbal promise",
          ],
          1,
          "Implementation needs rules and states, not only ideal snapshots.",
        ),
        question(
          "What should responsive design prioritize?",
          [
            "Making every item smaller",
            "Content and tasks appropriate to each available space",
            "Keeping the desktop width",
            "Removing all navigation",
          ],
          1,
          "Responsive design adapts hierarchy and behavior, not just dimensions.",
        ),
        question(
          "Which portfolio detail demonstrates design reasoning?",
          [
            "Only the final hero image",
            "Evidence, alternatives, decisions, and iteration",
            "A list of software logos",
            "An unexplained screen gallery",
          ],
          1,
          "A case study should show why decisions were made and what changed.",
        ),
        question(
          "What is the clearest success metric for a checkout usability test?",
          [
            "Participant says it looks modern",
            "Participant completes payment accurately without critical help",
            "The prototype has many screens",
            "The facilitator likes the colors",
          ],
          1,
          "Behavioral completion measures the task outcome directly.",
        ),
      ],
    },
  },
  "Full Stack Web Development": {
    duration: "12 weeks • Self-paced",
    description:
      "Progress from web fundamentals through accessible frontends, modern JavaScript, APIs, databases, authentication, testing, and deployment of a complete full-stack application.",
    syllabus: [
      {
        chapter: "Web and HTML Foundations",
        topics: [
          lesson(
            "How the Web Works",
            "Trace a request from a browser through DNS, HTTP, and a web server to a response. Understand URLs, methods, status codes, headers, and the client-server boundary.",
            [
              "DNS and request-response flow",
              "HTTP methods and status codes",
              "Client, server, and network responsibilities",
            ],
            18,
          ),
          lesson(
            "Semantic HTML Documents",
            "Build meaningful document structure with headings, landmarks, lists, links, and content elements. Use native semantics before adding custom behavior.",
            [
              "Document outline and landmarks",
              "Semantic elements over generic divs",
              "Valid nesting and meaningful links",
            ],
            18,
          ),
          lesson(
            "Forms and Native Validation",
            "Create accessible forms with associated labels, suitable input types, constraints, and clear error handling. Understand what the browser validates and what the server must revalidate.",
            [
              "Labels, names, and input types",
              "Client convenience versus server trust",
              "Helpful validation messages",
            ],
            20,
          ),
          lesson(
            "HTML Accessibility Essentials",
            "Use keyboard-operable native controls, useful alternative text, logical heading order, and semantic relationships that assistive technology can understand.",
            [
              "Keyboard-first controls",
              "Alternative text decisions",
              "Semantics before ARIA",
            ],
            18,
          ),
        ],
      },
      {
        chapter: "CSS and Responsive Interfaces",
        topics: [
          lesson(
            "Cascade, Specificity, and the Box Model",
            "Predict how styles win, understand content-box versus border-box sizing, and debug spacing with browser developer tools.",
            [
              "Cascade origin and specificity",
              "Margin, border, padding, content",
              "Consistent box sizing",
            ],
            20,
          ),
          lesson(
            "Modern Layout with Flexbox and Grid",
            "Use Flexbox for one-dimensional alignment and Grid for two-dimensional page structure. Build robust layouts without fragile positioning hacks.",
            [
              "Main and cross axes",
              "Grid tracks and gaps",
              "Intrinsic sizing and overflow",
            ],
            22,
          ),
          lesson(
            "Responsive Design and Media Queries",
            "Start with a usable small-screen layout, enhance at content-driven breakpoints, and combine fluid sizing with constrained reading widths.",
            [
              "Mobile-first enhancement",
              "Content-driven breakpoints",
              "min(), max(), clamp(), and relative units",
            ],
            20,
          ),
          lesson(
            "Reusable Styling and UI States",
            "Organize reusable styles, define tokens with custom properties, and cover hover, focus, disabled, loading, empty, and error states.",
            [
              "CSS custom properties",
              "Component boundaries",
              "Visible focus and state completeness",
            ],
            20,
          ),
        ],
      },
      {
        chapter: "Modern JavaScript",
        topics: [
          lesson(
            "Values, Functions, and Scope",
            "Use JavaScript values, expressions, functions, lexical scope, and closures. Prefer predictable data flow and understand the difference between mutation and reassignment.",
            [
              "let, const, and lexical scope",
              "Function declarations and expressions",
              "Closures and captured state",
            ],
            22,
          ),
          lesson(
            "Arrays, Objects, and Immutable Updates",
            "Model application data with arrays and objects and transform it using map, filter, reduce, spread, and destructuring without accidental shared mutation.",
            [
              "Array transformation methods",
              "Object and array destructuring",
              "Shallow immutable updates",
            ],
            22,
          ),
          lesson(
            "DOM Events and Browser APIs",
            "Select and update the DOM, handle bubbling events, and use browser APIs safely. Keep behavior accessible and avoid unnecessary manual DOM work in frameworks.",
            [
              "Event targets and propagation",
              "addEventListener and delegation",
              "DOM state versus application state",
            ],
            20,
          ),
          lesson(
            "Async JavaScript and Fetch",
            "Understand promises, async/await, network failure, HTTP failure, and cancellation. Build clear loading, success, empty, and error behavior around API calls.",
            [
              "Promise states and await",
              "Checking response.ok",
              "try/catch/finally and cancellation",
            ],
            24,
          ),
        ],
      },
      {
        chapter: "Backend APIs and Data",
        topics: [
          lesson(
            "Server Runtime and Routing",
            "Understand how a server receives requests, runs route logic, and sends responses. Separate routing, business rules, and data access for maintainability.",
            [
              "Request lifecycle",
              "Route handlers and middleware",
              "Layered responsibilities",
            ],
            20,
          ),
          lesson(
            "Designing RESTful APIs",
            "Design resource-oriented URLs, choose HTTP methods and status codes, validate payloads, and return consistent error shapes.",
            [
              "Resources and HTTP verbs",
              "Status code semantics",
              "Pagination and consistent responses",
            ],
            22,
          ),
          lesson(
            "MongoDB Data Modeling",
            "Model documents around application access patterns, use references or embedding intentionally, create indexes, and avoid unbounded duplicated data.",
            [
              "Embedding versus referencing",
              "Schema validation and indexes",
              "Modeling for query patterns",
            ],
            24,
          ),
          lesson(
            "Authentication and Authorization",
            "Build secure password and session flows, use HTTP-only cookies, enforce authorization on the server, and understand common web attack boundaries.",
            [
              "Hashing and session cookies",
              "Authentication versus authorization",
              "Server-side ownership checks",
            ],
            24,
          ),
        ],
      },
      {
        chapter: "Production Full-Stack Delivery",
        topics: [
          lesson(
            "Frontend and API Integration",
            "Connect interface state to backend resources with deliberate caching and mutation behavior. Prevent stale views and race conditions after writes.",
            [
              "Server and client state",
              "Mutation feedback and refetching",
              "Stable loading states",
            ],
            22,
          ),
          lesson(
            "Validation, Errors, and Observability",
            "Validate untrusted input, centralize meaningful errors, log useful context without secrets, and expose health signals that make failures diagnosable.",
            [
              "Boundary validation",
              "Structured errors and logs",
              "Never logging credentials or tokens",
            ],
            20,
          ),
          lesson(
            "Automated Testing Strategy",
            "Balance unit, integration, and end-to-end tests. Test critical user outcomes, isolate external systems, and keep suites deterministic.",
            [
              "Testing pyramid and risk",
              "API integration checks",
              "User-visible E2E assertions",
            ],
            22,
          ),
          lesson(
            "Deployment, Security, and Performance",
            "Prepare environment configuration, production builds, database indexes, secure headers, asset optimization, monitoring, and rollback plans for a real release.",
            [
              "Environment secrets and build checks",
              "Performance and caching basics",
              "Health checks, monitoring, and rollback",
            ],
            24,
          ),
        ],
      },
    ],
    finalAssessment: {
      title: "Full Stack Web Development Final Assessment",
      durationMinutes: 45,
      passingScore: 70,
      questions: [
        question(
          "What happens after a browser resolves a domain with DNS?",
          [
            "It typically connects to the resolved server and sends an HTTP request",
            "It compiles the database",
            "It rewrites the domain",
            "It creates a cookie automatically",
          ],
          0,
          "DNS supplies the address used for the network connection.",
        ),
        question(
          "Which status code best represents a newly created resource?",
          ["200", "201", "302", "404"],
          1,
          "201 Created communicates successful resource creation.",
        ),
        question(
          "Why use semantic HTML?",
          [
            "It always makes CSS unnecessary",
            "It communicates structure to browsers and assistive technologies",
            "It encrypts content",
            "It prevents network errors",
          ],
          1,
          "Native semantics improve understanding and interoperability.",
        ),
        question(
          "Where must form input be validated for security?",
          [
            "Only in CSS",
            "On the server, even if the browser also validates",
            "Only in placeholder text",
            "Only after database insertion",
          ],
          1,
          "Client validation can be bypassed; the server is the trust boundary.",
        ),
        question(
          "What determines an element's total size under border-box?",
          [
            "Declared width includes padding and border",
            "Margins become part of width",
            "Content is always zero",
            "Specificity is ignored",
          ],
          0,
          "border-box includes border and padding within the declared dimensions.",
        ),
        question(
          "Which layout system is designed for two-dimensional rows and columns?",
          ["Float", "Grid", "Inline text", "Absolute positioning"],
          1,
          "CSS Grid controls rows and columns together.",
        ),
        question(
          "What is a good responsive breakpoint?",
          [
            "A device brand",
            "A width where content or layout needs adaptation",
            "Always exactly 768px",
            "The database document count",
          ],
          1,
          "Breakpoints should respond to layout pressure, not device labels.",
        ),
        question(
          "What does a closure retain?",
          [
            "Access to variables from its lexical creation scope",
            "A network socket forever",
            "Only global CSS",
            "An HTML parser",
          ],
          0,
          "Functions close over their surrounding lexical environment.",
        ),
        question(
          "Which method creates an array by transforming every source item?",
          ["filter", "map", "some", "find"],
          1,
          "map returns one transformed result per source element.",
        ),
        question(
          "Why use immutable state updates in UI code?",
          [
            "They make change detection and reasoning more predictable",
            "They remove all memory use",
            "They avoid every rerender",
            "They modify the database automatically",
          ],
          0,
          "New references make state transitions explicit.",
        ),
        question(
          "What is event delegation?",
          [
            "Handling descendant events from a shared ancestor",
            "Disabling bubbling",
            "Sending events to the database",
            "Rendering every element twice",
          ],
          0,
          "Bubbling lets an ancestor manage events for many descendants.",
        ),
        question(
          "Why check response.ok after fetch?",
          [
            "fetch can resolve even for HTTP error status codes",
            "It parses JSON automatically",
            "It enables DNS",
            "It hides CORS",
          ],
          0,
          "Network completion and HTTP success are different conditions.",
        ),
        question(
          "Which API route is most resource-oriented?",
          [
            "/getAllCourseThings",
            "/courses/123",
            "/pleaseDelete",
            "/runDatabaseNow",
          ],
          1,
          "Resource URLs identify nouns; the HTTP method expresses the action.",
        ),
        question(
          "When is referencing preferable to embedding in MongoDB?",
          [
            "When shared data changes independently and duplication would become stale",
            "For every one-field object",
            "Only when no indexes exist",
            "Never",
          ],
          0,
          "References reduce duplication for independently managed entities.",
        ),
        question(
          "What is an index tradeoff?",
          [
            "Faster reads for indexed queries but added storage and write cost",
            "It eliminates schema design",
            "It encrypts documents",
            "It guarantees every query is fast",
          ],
          0,
          "Indexes accelerate matching/sorting while adding maintenance overhead.",
        ),
        question(
          "Which cookie setting prevents JavaScript from reading a session token?",
          ["SameSite", "HttpOnly", "Path", "Max-Age"],
          1,
          "HttpOnly blocks document.cookie access to that cookie.",
        ),
        question(
          "What is authorization?",
          [
            "Checking what an authenticated identity may do",
            "Hashing CSS",
            "Resolving DNS",
            "Rendering a loading spinner",
          ],
          0,
          "Authentication establishes identity; authorization enforces permissions.",
        ),
        question(
          "What prevents stale UI after a successful mutation?",
          [
            "Deliberately updating or refetching the affected client state",
            "Ignoring the response",
            "Adding more global variables",
            "Disabling errors",
          ],
          0,
          "The client must reconcile its cached view with the server change.",
        ),
        question(
          "Which test best proves a learner can complete a critical flow?",
          [
            "An end-to-end browser test of the visible outcome",
            "A color snapshot only",
            "A linter warning",
            "A database shell history",
          ],
          0,
          "E2E tests exercise integrated behavior from the user's perspective.",
        ),
        question(
          "What is essential before a production deployment?",
          [
            "A passing production build, environment validation, tests, and a rollback path",
            "Hard-coded secrets",
            "Deleting logs",
            "Skipping database backups",
          ],
          0,
          "Release readiness includes verification and recoverability.",
        ),
      ],
    },
  },
};

function preserveIds(nextSyllabus, previousSyllabus = []) {
  const oldChapters = new Map(
    previousSyllabus.map((chapter) => [chapter.chapter, chapter]),
  );
  return nextSyllabus.map((chapter) => {
    const oldChapter = oldChapters.get(chapter.chapter);
    const oldTopics = new Map(
      (oldChapter?.topics || []).map((topic) => [topic.topicName, topic]),
    );
    return {
      ...chapter,
      _id: oldChapter?._id || new ObjectId(),
      topics: chapter.topics.map((topic) => ({
        ...topic,
        _id: oldTopics.get(topic.topicName)?._id || new ObjectId(),
      })),
    };
  });
}

const uri = process.env.MONGODB_URI;
if (!uri) throw new Error("MONGODB_URI is required");
const client = new MongoClient(uri);
await client.connect();
const db = client.db();
const coursesCollection = db.collection("courses");
const usersCollection = db.collection("users");
const previousCourses = await coursesCollection
  .find({ name: { $in: Object.keys(content) } })
  .toArray();
const previousById = new Map(
  previousCourses.map((course) => [course._id.toString(), course]),
);
const updatedById = new Map();
const courseImages = {
  "Learn Python Programming": {
    img1: "/python.png.webp",
    img2: "/images/northstar-learning-hero.png",
  },
  "Full Stack Web Development": {
    img1: "/web-development.png.webp",
    img2: "/banner-web.png",
  },
  "Master UX/UI Design": {
    img1: "/images/northstar-learning-hero.png",
    img2: "/practical.png.webp",
  },
};

for (const previous of previousCourses) {
  const next = content[previous.name];
  const media = courseImages[previous.name];
  const syllabus = preserveIds(next.syllabus, previous.syllabus);
  const previousQuestions = new Map(
    (previous.finalAssessment?.questions || []).map((item) => [
      item.prompt,
      item,
    ]),
  );
  const finalAssessment = {
    ...next.finalAssessment,
    questions: next.finalAssessment.questions.map((item) => ({
      ...item,
      _id: previousQuestions.get(item.prompt)?._id || new ObjectId(),
    })),
  };
  await coursesCollection.updateOne(
    { _id: previous._id },
    {
      $set: {
        ...next,
        ...media,
        syllabus,
        finalAssessment,
        updatedAt: new Date(),
      },
    },
  );
  updatedById.set(previous._id.toString(), {
    ...previous,
    ...next,
    ...media,
    syllabus,
    finalAssessment,
  });
}

const users = await usersCollection.find({}).toArray();
for (const user of users) {
  const sources =
    user.enrollments ||
    (user.courses || []).map((course) => ({
      courseId: course._id,
      completedTopicIds: (course.syllabus || []).flatMap((chapter) =>
        (chapter.topics || [])
          .filter((topic) => topic.topicProgress)
          .map((topic) => topic._id),
      ),
      progressPercent: course.progress_status || 0,
      enrolledAt: course.createdAt || new Date(),
    }));

  const enrollments = sources.flatMap((source) => {
    const courseId = source.courseId?.toString();
    const previous = previousById.get(courseId);
    const updated = updatedById.get(courseId);
    if (!previous || !updated) return [];

    const oldNameById = new Map(
      previous.syllabus.flatMap((chapter) =>
        chapter.topics.map((topic) => [topic._id.toString(), topic.topicName]),
      ),
    );
    const completedNames = new Set(
      (source.completedTopicIds || [])
        .map((id) => oldNameById.get(id.toString()))
        .filter(Boolean),
    );
    const completedTopicIds = updated.syllabus.flatMap((chapter) =>
      chapter.topics
        .filter((topic) => completedNames.has(topic.topicName))
        .map((topic) => topic._id),
    );
    const total = updated.syllabus.reduce(
      (sum, chapter) => sum + chapter.topics.length,
      0,
    );
    return [
      {
        courseId: updated._id,
        completedTopicIds,
        progressPercent: Math.round((completedTopicIds.length / total) * 100),
        assessmentResult: source.assessmentResult || {
          status: "not_started",
          attempts: 0,
          bestScore: 0,
          lastScore: 0,
        },
        enrolledAt: source.enrolledAt || new Date(),
      },
    ];
  });

  await usersCollection.updateOne(
    { _id: user._id },
    { $set: { enrollments }, $unset: { courses: "" } },
  );
}

console.log(
  JSON.stringify({
    coursesUpdated: updatedById.size,
    usersMigrated: users.length,
    lessons: Object.values(content).reduce(
      (sum, course) =>
        sum +
        course.syllabus.reduce(
          (count, chapter) => count + chapter.topics.length,
          0,
        ),
      0,
    ),
    questions: Object.values(content).reduce(
      (sum, course) => sum + course.finalAssessment.questions.length,
      0,
    ),
  }),
);
await client.close();
