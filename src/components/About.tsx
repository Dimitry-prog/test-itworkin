import React, { ChangeEvent, FormEvent, useState } from 'react';
import Form from './Form';
import { useAppDispatch, useAppSelector } from '../hooks/reduxHooks';
import { aboutActions, CustomTextType } from '../store/slices/aboutSlice';

const About = () => {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const dispatch = useAppDispatch();
  const customText = useAppSelector((state) => state.about.customText);
  const combineText = `some text for default ${customText.partOne} some lorem ${customText.partTwo} input here`;
  const [data, setData] = useState<CustomTextType>({
    partOne: 'one',
    partTwo: 'two',
  });

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    dispatch(aboutActions.setCustomText(data));
    setIsEditing(false);
  };

  const handleCancel = () => {
    setData(customText);
    setIsEditing(false);
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setData((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  };

  const content = (
    <div className="flex flex-col gap-5">
      <div className="flex gap-2 flex-wrap">
        <p>some text for default</p>
        <input
          value={data.partOne}
          onChange={handleChange}
          type="text"
          name="partOne"
          className="bg-amber-100 rounded-md outline-none"
        />
        <p>some lorem</p>
        <input
          value={data.partTwo}
          onChange={handleChange}
          type="text"
          name="partTwo"
          className="bg-amber-100 rounded-md outline-none"
        />
        <p>input here</p>
      </div>
      <div className="flex gap-4">
        <button className="w-fit p-4 rounded-md bg-amber-100" type="submit">
          Save
        </button>
        <button onClick={handleCancel} className="w-fit p-4 rounded-md bg-gray-500" type="button">
          Cancel
        </button>
      </div>
    </div>
  );

  return (
    <>
      {isEditing ? (
        <Form content={content} onSubmit={handleSubmit} />
      ) : (
        <div className="flex flex-col gap-2">
          <p>{combineText}</p>
          <button onClick={handleEdit} className="w-fit p-1 bg-gray-400 rounded-md">
            Edit
          </button>
        </div>
      )}
    </>
  );
};

export default About;
