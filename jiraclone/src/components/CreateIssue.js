import { useState } from "react";
import { FaPlus } from "react-icons/fa"; // Importing + icon from react-icons
import { useProjectData } from "../context/Context";
export default function CreateIssue({ toggleModal, projectId }) {
  const today = new Date()
  today.setHours(24)
  const {state, setState} = useProjectData()
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [deadline, setDeadline] = useState()
  const [status, setStatus] = useState('TODO');
  const [taskType, setTaskType] = useState('FEATURE');
  const [priority, setPriority] = useState('LOW');
  const [assignees, setAssignees] = useState([]); // Assignees as integers
  const [newAssignee, setNewAssignee] = useState(''); // State for new assignee ID input
  const [loading, setLoading] = useState(false); // Loading state to disable button during request


  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Set loading state to true while request is in progress

    const issueData = {
      title,
      description,
      deadline: `${deadline}T00:00:00.000Z`,
      status,
      taskType,
      priority,
      assignees,
    };
    // console.log(issueData)
    try {
      const response = await fetch(`api/projects/${projectId}/tasks`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(issueData),
      });
      // console.log(response);
      if (response.ok) {
        const resJson = await response.json();
        setState(!state)
        console.log("Issue created successfully:", resJson);
        alert("Issue created successfully")
        toggleModal();
      } else {
        alert("Error creating issue")
        console.error("Error creating issue:", response.statusText);
      }
    } catch (error) {
      console.error("Request failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddAssignee = () => {
    const assigneeId = parseInt(newAssignee, 10);

    if (!isNaN(assigneeId) && Number.isInteger(assigneeId)) {
      if (!assignees.includes(assigneeId)) {
        setAssignees([...assignees, assigneeId]);
        setNewAssignee(''); // Clear the input field
      } else {
        alert('Assignee ID already exists.');
      }
    } else {
      alert('Please enter a valid integer.');
    }
  };


  return (
    <form
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
      onSubmit={handleSubmit} // Form submission handler
    >
      <div className="bg-white p-6 rounded-lg shadow-lg w-6/12">
        <h2 className="text-lg font-semibold mb-4">Create Issue</h2>

        {/* Issue Type Dropdown */}
        <label className="block mb-2 text-sm font-medium text-gray-700">Issue Type</label>
        <select
          className="w-full p-2 mb-4 border border-gray-300 rounded"
          value={taskType}
          onChange={(e) => setTaskType(e.target.value)}
        >
          <option value="FEATURE">Feature</option>
          <option value="TASK">Task</option>
          <option value="BUG">Bug</option>
          <option value="ISSUE">Issue</option>
        </select>

        {/* Title */}
        <label className="block mb-2 text-sm font-medium text-gray-700">Title</label>
        <input
          type="text"
          className="w-full p-2 mb-4 border border-gray-300 rounded"
          placeholder="Enter a title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        {/* Description */}
        <label className="block mb-2 text-sm font-medium text-gray-700">Description</label>
        <textarea
          className="w-full p-2 mb-4 border border-gray-300 rounded"
          placeholder="Enter a description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        ></textarea>


        {/* Deadline */}
        <label className="block mb-2 text-sm font-medium text-gray-700">Deadline</label>
        <input
          type="date"
          className="w-full p-2 mb-4 border border-gray-300 rounded"
          value={deadline}
          onChange={(e) => setDeadline(e.target.value)}
          min = {today.toISOString().split('T')[0]}
          required
        />

        {/* Assignees */}
        <label className="block mb-2 text-sm font-medium text-gray-700">Add Assignee IDs</label>
        <div className="flex items-center space-x-2 mb-4">
          <select multiple className="w-full p-2 border border-gray-300 rounded">
            {assignees.map((assigneeId) => (
              <option key={assigneeId} value={assigneeId}>{assigneeId}</option>
            ))}
          </select>
          <input
            type="number"
            className="p-2 border border-gray-300 rounded"
            placeholder="Enter new Assignee ID"
            value={newAssignee}
            onChange={(e) => setNewAssignee(e.target.value)}
          />
          <button
            type="button"
            onClick={handleAddAssignee}
            className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            <FaPlus />
          </button>
        </div>

        {/* Priority Dropdown */}
        <label className="block mb-2 text-sm font-medium text-gray-700">Priority</label>
        <select
          className="w-full p-2 mb-4 border border-gray-300 rounded"
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
        >
          <option value="LOW">Low</option>
          <option value="MEDIUM">Medium</option>
          <option value="HIGH">High</option>
          <option value="CRITICAL">Critical</option>
        </select>

        {/* Actions */}
        <div className="flex justify-end">
          <button
            type="button"
            onClick={toggleModal}
            className="px-4 py-2 mr-2 bg-gray-300 text-black rounded hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            disabled={loading}
          >
            {loading ? 'Creating...' : 'Create Issue'}
          </button>
        </div>
      </div>
    </form>
  );
}
