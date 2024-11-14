import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "react-toastify/dist/ReactToastify.css";
import { DoctorContext } from "../../context/DoctorContext";

const EditWorkSchedule = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getScheduleById, updateSchedule } = useContext(DoctorContext);
  const [schedule, setSchedule] = useState(null);
  const [scheduleForm, setScheduleForm] = useState({
    workDate: null,
    timeSlot: "",
  });

  useEffect(() => {
    const fetchSchedule = async () => {
      if (id) {
        const scheduleData = await getScheduleById(id);
        if (scheduleData) {
          setSchedule(scheduleData);
          setScheduleForm({
            workDate: new Date(scheduleData.work_date),
            timeSlot: scheduleData.work_shift,
          });
        }
      }
    };
    fetchSchedule();
  }, [id, getScheduleById]);

  const handleDateChange = (date) => {
    setScheduleForm((prevForm) => ({
      ...prevForm,
      workDate: date,
    }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setScheduleForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const updatedSchedule = {
      work_date: scheduleForm.workDate.toISOString().split("T")[0],
      work_shift: scheduleForm.timeSlot,
    };
    await updateSchedule(id, updatedSchedule);
    navigate("/doctor-work-schedule");
  };

  if (!schedule) return <p>Loading...</p>;

  return (
    <div className="max-w-2xl mx-auto p-5">
      <div className="bg-white p-8 rounded-lg shadow-lg" style={{ width: '480px' }}>
        <h2 className="text-2xl font-semibold mb-5">
          Chỉnh Sửa Lịch Làm Việc của Bác Sĩ
        </h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Work Date */}
          <div>
            <label className="block text-gray-700 mb-2">Ngày làm việc</label>
            <DatePicker
              selected={scheduleForm.workDate}
              onChange={handleDateChange}
              dateFormat="dd/MM/yyyy"
              minDate={new Date()}
              className="w-[415px] p-3 border rounded focus:outline-none focus:border-black"
            />
          </div>

          {/* Time Slot */}
          <div>
            <label className="block text-gray-700 mb-2">Ca làm việc</label>
            <select
              name="timeSlot"
              value={scheduleForm.timeSlot}
              onChange={handleInputChange}
              required
              className="w-full p-3 border rounded focus:outline-none focus:border-black"
            >
              <option value="" disabled>
                Chọn ca làm việc
              </option>
              <option value="morning">Buổi sáng</option>
              <option value="afternoon">Buổi chiều</option>
            </select>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3 mt-5 bg-[#219B9D] text-white rounded hover:bg-[#0091a1] font-semibold"
          >
            Cập nhật Lịch Làm Việc
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditWorkSchedule;