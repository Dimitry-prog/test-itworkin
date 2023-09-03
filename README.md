Конечно, вот поэтапный план:

Создать React-приложение с помощью Create React App.
lua
Copy
npx create-react-app my-app --template typescript
Создать компонент, который будет содержать формы About и Revenue.
typescript
Copy
import React from 'react';

type Props = {
aboutContent: string;
revenueData: { month: string; year: number; amount: number; }[];
onSaveAbout: (content: string) => void;
onSaveRevenue: (data: { month: string; year: number; amount: number; }) => void;
};

const MyComponent: React.FC<Props> = ({ aboutContent, revenueData, onSaveAbout, onSaveRevenue }) => {
// Код компонента
};
Создать компонент для формы About.
typescript
Copy
import React, { useState } from 'react';

type Props = {
content: string;
onSave: (content: string) => void;
};

const AboutForm2: React.FC<Props> = ({ content, onSave }) => {
const [editing, setEditing] = useState(false);
const [text, setText] = useState(content);

const handleEditClick = () => {
setEditing(true);
};

const handleSaveClick = () => {
onSave(text);
setEditing(false);
};

const handleCancelClick = () => {
setText(content);
setEditing(false);
};

const handleTextChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
setText(event.target.value);
};

return (
<div>
{editing ? (
<div>
<textarea value={text} onChange={handleTextChange} />
<button onClick={handleSaveClick}>Save</button>
<button onClick={handleCancelClick}>Cancel</button>
</div>
) : (
<div>
<p>{content}</p>
<button onClick={handleEditClick}>Edit</button>
</div>
)}
</div>
);
};
Создать компонент для формы Revenue.
typescript
Copy
import React, { useState } from 'react';

type Props = {
data: { month: string; year: number; amount: number; }[];
onSave: (data: { month: string; year: number; amount: number; }) => void;
};

const RevenueForm2: React.FC<Props> = ({ data, onSave }) => {
const [months, setMonths] = useState(data);

const handleAddClick = () => {
setMonths([...months, { month: '', year: new Date().getFullYear(), amount: 0 }]);
};

const handleRemoveClick = (index: number) => {
setMonths(months.filter((_, i) => i !== index));
};

const handleSaveClick = () => {
months.forEach(onSave);
};

const handleMonthChange = (index: number, month: string) => {
setMonths(months.map((m, i) => i === index ? { ...m, month } : m));
};

const handleYearChange = (index: number, year: number) => {
setMonths(months.map((m, i) => i === index ? { ...m, year } : m));
};

const handleAmountChange = (index: number, amount: number) => {
setMonths(months.map((m, i) => i === index ? { ...m, amount } : m));
};

return (
<div>
{months.map((month, index) => (
<div key={index}>
<input type="text" value={month.month} onChange={event => handleMonthChange(index, event.target.value)} />
<input type="number" value={month.year} onChange={event => handleYearChange(index, parseInt(event.target.value))} />
<input type="number" value={month.amount} onChange={event => handleAmountChange(index, parseInt(event.target.value))} />
<button onClick={() => handleRemoveClick(index)}>Remove</button>
</div>
))}
<button onClick={handleAddClick}>Add</button>
<button onClick={handleSaveClick}>Save</button>
</div>
);
};
Использовать созданные компоненты внутри MyComponent.
typescript
Copy
import React from 'react';
import AboutForm2 from './AboutForm2';
import RevenueForm2 from './RevenueForm2';

type Props = {
aboutContent: string;
revenueData: { month: string; year: number; amount: number; }[];
onSaveAbout: (content: string) => void;
onSaveRevenue: (data: { month: string; year: number; amount: number; }) => void;
};

const MyComponent: React.FC<Props> = ({ aboutContent, revenueData, onSaveAbout, onSaveRevenue }) => {
return (
<div>
<AboutForm content={aboutContent} onSave={onSaveAbout} />
<RevenueForm data={revenueData} onSave={onSaveRevenue} />
</div>
);
};
Добавить глобальный стейт с помощью Context API или Redux.
typescript
Copy
import React, { createContext, useContext, useReducer } from 'react';

type State = {
aboutContent: string;
revenueData: { month: string; year: number; amount: number; }[];
};

type Action =
| { type: 'SET_ABOUT_CONTENT'; content: string }
| { type: 'ADD_REVENUE_DATA'; data: { month: string; year: number; amount: number; } }
| { type: 'REMOVE_REVENUE_DATA'; index: number }
| { type: 'UPDATE_REVENUE_DATA'; index: number; data: { month?: string; year?: number; amount?: number; } };

type Dispatch = (action: Action) => void;

const initialState = {
aboutContent: '',
revenueData: [],
};

const AppContext = createContext<{ state: State; dispatch: Dispatch }>({ state: initialState, dispatch() {} });

const reducer = (state: State, action: Action): State => {
switch (action.type) {
case 'SET_ABOUT_CONTENT':
return { ...state, aboutContent: action.content };
case 'ADD_REVENUE_DATA':
return { ...state, revenueData: [...state.revenueData, action.data] };
case 'REMOVE_REVENUE_DATA':
return { ...state, revenueData: state.revenueData.filter((_, i) => i !== action.index) };
case 'UPDATE_REVENUE_DATA':
return {
...state,
revenueData: state.revenueData.map((data, i) =>
i === action.index ? { ...data, ...action.data } : data
),
};
default:
return state;
}
};

export const AppProvider: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
const [state, dispatch] = useReducer(reducer, initialState);

return (
<AppContext.Provider value={{ state, dispatch }}>
{children}
</AppContext.Provider>
);
};

export const useAppContext = () => useContext(AppContext);
Использовать глобальный стейт в MyComponent.
typescript
Copy
import React from 'react';
import AboutForm2 from './AboutForm2';
import RevenueForm2 from './RevenueForm2';
import { useAppContext } from './AppContext';

const MyComponent = () => {
const { state, dispatch } = useAppContext();

const handleSaveAbout = (content: string) => {
dispatch({ type: 'SET_ABOUT_CONTENT', content });
};

const handleSaveRevenue = (data: { month: string; year: number; amount: number; }) => {
dispatch({ type: 'ADD_REVENUE_DATA', data });
};

const handleRemoveRevenue = (index: number) => {
dispatch({ type: 'REMOVE_REVENUE_DATA', index });
};

const handleUpdateRevenue = (index: number, data: { month?: string; year?: number; amount?: number; }) => {
dispatch({ type: 'UPDATE_REVENUE_DATA', index, data });
};

return (
<div>
<AboutForm content={state.aboutContent} onSave={handleSaveAbout} />
<RevenueForm data={state.revenueData} onSave={handleSaveRevenue} onRemove={handleRemoveRevenue} onUpdate={handleUpdateRevenue} />
</div>
);
};
Обновить компонент RevenueForm2 для использования глобального стейта.
typescript
Copy
import React from 'react';
import { useAppContext } from './AppContext';

type Props = {};

const RevenueForm2 = () => {
const { state, dispatch } = useAppContext();

const handleAddClick = () => {
dispatch({ type: 'ADD_REVENUE_DATA', data });
};

const handleRemoveClick = (index: number) => {
dispatch({ type: 'REMOVE_REVENUE_DATA', index });
};

const handleSaveClick = () => {
state.revenueData.forEach((data, index) =>
dispatch({ type: 'UPDATE_REVENUE_DATA', index, data })
);
};

const handleMonthChange = (index: number, month: string) => {
dispatch({ type: 'UPDATE_REVENUE_DATA', index, data: { month } });
};

const handleYearChange = (index: number, year?: number) => {
dispatch({ type: 'UPDATE_REVENUE_DATA', index, data: { year } });
};

const handleAmountChange = (index: number, amount?: number) => {
dispatch({ type: 'UPDATE_REVENUE_DATA', index, data: { amount } });
};

return (
<div>
{state.revenueData.map((data, index) => (
<div key={index}>
<input type="text" value={data.month} onChange={event => handleMonthChange(index, event.target.value)} />
<input type="number" value={data.year} onChange={event => handleYearChange(index, parseInt(event.target.value))} />
<input type="number" value={data.amount} onChange={event => handleAmountChange(index, parseInt(event.target.value))} />
<button onClick={() => handleRemoveClick(index)}>Remove</button>
</div>
))}
<button onClick={handleAddClick}>Add</button>
<button onClick={handleSaveClick}>Save</button>
</div>
);
};
Это только общий план и не содержит всех деталей реализации. Но я надеюсь это поможет тебе начать работу над проектом!

начиная с пункта 6 перепеши на redux toolkit

Конечно, вот обновленный план:

Установить Redux Toolkit.
bash
Copy
npm install @reduxjs/toolkit
Создать store с помощью createSlice.
ini
Copy
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type AboutState = {
content: string;
};

const aboutSlice = createSlice({
name: 'about',
initialState: { content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.' } as AboutState,
reducers: {
setContent: (state, action: PayloadAction<string>) => {
state.content = action.payload;
},
},
});

type RevenueData = { month: string; year: number; amount: number; };
type RevenueState = {
data: RevenueData[];
};

const revenueSlice = createSlice({
name: 'revenue',
initialState: { data: [] } as RevenueState,
reducers: {
addData: (state, action: PayloadAction<RevenueData>) => {
state.data.push(action.payload);
},
removeData: (state, action: PayloadAction<number>) => {
state.data.splice(action.payload, 1);
},
updateData: (state, action: PayloadAction<{ index: number; data: RevenueData }>) => {
state.data[action.payload.index] = action.payload.data;
},
},
});

const rootReducer = combineReducers({
about: aboutSlice.reducer,
revenue: revenueSlice.reducer,
});

export const store = configureStore({
reducer: rootReducer,
});
Изменить компоненты, чтобы они использовали данные из Redux и диспетчеры для обновления данных.
typescript
Copy
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from './store';
import { setContent } from './aboutSlice';
import { addData, removeData, updateData } from './revenueSlice';

type Props = {};

const MyComponent: React.FC<Props> = () => {
const aboutContent = useSelector((state: RootState) => state.about.content);
const revenueData = useSelector((state: RootState) => state.revenue.data);
const dispatch = useDispatch();

const handleAboutSave = (content: string) => {
dispatch(setContent(content));
};

const handleRevenueAdd = () => {
dispatch(addData({ month: '', year: new Date().getFullYear(), amount: 0 }));
};

const handleRevenueRemove = (index: number) => {
dispatch(removeData(index));
};

const handleRevenueUpdate = (index: number, data: { month: string; year: number; amount: number; }) => {
dispatch(updateData({ index, data }));
};

return (
<div>
<AboutForm content={aboutContent} onSave={handleAboutSave} />
<RevenueForm data={revenueData} onAdd={handleRevenueAdd} onRemove={handleRevenueRemove} onUpdate={handleRevenueUpdate} />
</div>
);
};
Обновить компоненты форм, чтобы они использовали данные из Redux и диспетчеры для обновления данных.
typescript
Copy
import React from 'react';
import { useDispatch } from 'react-redux';
import { setData } from './revenueSlice';

type Props = {
data: { month: string; year: number; amount: number; }[];
onAdd: () => void;
onRemove: (index: number) => void;
onUpdate: (index: number, data: { month: string; year: number; amount: number; }) => void;
};

const RevenueForm2: React.FC<Props> = ({ data, onAdd, onRemove, onUpdate }) => {
const dispatch = useDispatch();

const handleAddClick = () => {
onAdd();
};

const handleRemoveClick = (index: number) => {
onRemove(index);
};

const handleMonthChange = (index: number, event: React.ChangeEvent<HTMLSelectElement>) => {
const newData = { ...data[index], month: event.target.value };
onUpdate(index, newData);
};

const handleYearChange = (index: number, event: React.ChangeEvent<HTMLSelectElement>) => {
const newData = { ...data[index], year: parseInt(event.target.value) };
onUpdate(index, newData);
};

const handleAmountChange = (index: number, event: React.ChangeEvent<HTMLInputElement>) => {
const newData = { ...data[index], amount: parseFloat(event.target.value) };
onUpdate(index, newData);
};

const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
event.preventDefault();
dispatch(setData(data));
};

return (
<div>
<h2>Revenue</h2>
<form onSubmit={handleSubmit}>
<table>
<thead>
<tr>
<th>Month</th>
<th>Year</th>
<th>Amount</th>
<th></th>
</tr>
</thead>
<tbody>
{data.map((item, index) => (
<tr key={index}>
<td>
<select value={item.month} onChange={(event) => handleMonthChange(index, event)}>
<option value="January">January</option>
<option value="February">February</option>
<option value="March">March</option>
<option value="April">April</option>
<option value="May">May</option>
<option value="June">June</option>
<option value="July">July</option>
<option value="August">August</option>
<option value="September">September</option>
<option value="October">October</option>
<option value="November">November</option>
<option value="December">December</option>
</select>
</td>
<td>
<select value={item.year} onChange={(event) => handleYearChange(index, event)}>
{[...Array(10)].map((_, i) => (
<option key={i} value={new Date().getFullYear() - i}>{new Date().getFullYear() - i}</option>
))}
</select>
</td>
<td><input type="number" step="0.01" min="0" value={item.amount} onChange={(event) => handleAmountChange(index, event)} /></td>
<td><button type="button" onClick={() => handleRemoveClick(index)}>Remove</button></td>
</tr>
))}
</tbody>
</table>
<button type="button" onClick={handleAddClick}>Add Month</button>
<button type="submit">Save</button>
</form>
</div>
);
};