import React, { useState, useEffect } from 'react';
import './styles/ReservationsContent.css';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

const schema = yup.object({
  name: yup.string().required('Full name is a required field!'),
  email: yup
    .string()
    .required('Email is a required field!')
    .email('Email is not valid!'),
  telephone: yup
    .string()
    .required('Telephone is a required field!')
    .matches(/^[6-9]\d{9}$/, 'Phone number must be 10 digits and start with 6, 7, 8, or 9.'),
  guests: yup.number().min(1, 'There must be at least 1 guest!').required('Please specify number of guests per table!'),
  date: yup.string().required('Please select date and time!'),
});

const seededRandom = function (seed) {
  var m = 2 ** 35 - 31;
  var a = 185852;
  var s = seed % m;
  return function () {
    return (s = (s * a) % m) / m;
  };
};

const fetchAPI = function (date) {
  let result = [];
  let random = seededRandom(date.getDate());

  for (let i = 17; i <= 23; i++) {
    if (random() < 0.5) {
      result.push(i + ':00');
    }
    if (random() < 0.5) {
      result.push(i + ':30');
    }
  }
  return result;
};

const submitAPI = function (formData) {
  console.log('Form data submitted:', formData);
  return true;
};

function Form() {
  const { handleSubmit, register, formState: { errors }, setValue } = useForm({
    resolver: yupResolver(schema),
  });

  const [availableTimes, setAvailableTimes] = useState([]);
  const [selectedDate, setSelectedDate] = useState('');

  // Fetch available times when date is selected or page loads
  const fetchAvailableTimes = (date) => {
    const times = fetchAPI(date);
    setAvailableTimes(times);
  };

  // Update available times when date is selected
  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
    const date = new Date(e.target.value);
    fetchAvailableTimes(date);
  };

  // Submit the form
  const formSubmit = (data) => {
    if (submitAPI(data)) {
      alert('Reservation successfully submitted');
    } else {
      alert('Failed to submit reservation');
    }
  };

  useEffect(() => {
    // Initialize with today's date for the available times
    const today = new Date();
    fetchAvailableTimes(today);
  }, []);

  return (
    <form onSubmit={handleSubmit(formSubmit)}>
      <fieldset>
        <div className="field">
          <label htmlFor="name">Full Name</label>
          <input type="text" placeholder="John Doe" name="name" {...register('name')} />
          <span className="error-message">{errors.name?.message}</span>
        </div>
        <div className="field">
          <label htmlFor="email">Email</label>
          <input type="text" placeholder="text@email.com" name="email" {...register('email')} />
          <span className="error-message">{errors.email?.message}</span>
        </div>
        <div className="field">
          <label htmlFor="telephone">Telephone</label>
          <input type="tel" placeholder="9898989898" name="telephone" {...register('telephone')} />
          <span className="error-message">{errors.telephone?.message}</span>
        </div>

        <div className="field occasion">
          <label htmlFor="occasion">Occasion (optional)</label>
          <div className="options">
            <select name="occasion" {...register('occasion')}>
              <option value="select">Select occasion</option>
              <option value="birthday">Birthday</option>
              <option value="engagement">Engagement</option>
              <option value="anniversary">Anniversary</option>
            </select>
          </div>
        </div>
        <div className="field guest">
          <label htmlFor="guests">Guests</label>
          <input type="number" placeholder="2" name="guests" {...register('guests')} />
          <span className="error-message">{errors.guests?.message}</span>
        </div>

        <div className="field">
          <label htmlFor="date">Date & Time</label>
          <input
            type="datetime-local"
            name="date"
            {...register('date')}
            onChange={handleDateChange}
          />
          <span className="error-message">{errors.date?.message}</span>
        </div>

        <div className="field">
          <label htmlFor="time">Available Times</label>
          <select name="time" {...register('time')}>
            {availableTimes.length > 0 ? (
              availableTimes.map((time, index) => (
                <option key={index} value={time}>
                  {time}
                </option>
              ))
            ) : (
              <option value="">No available times</option>
            )}
          </select>
        </div>

        <button className="reserve-btn" type="submit">
          Reserve
        </button>
      </fieldset>
    </form>
  );
}

export default Form;
