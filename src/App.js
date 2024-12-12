import { useState } from "react";

const initialFriends = [
  {
    id: 118836,
    name: "Clark",
    image: "https://i.pravatar.cc/48?u=118836",
    balance: -7,
  },
  {
    id: 933372,
    name: "Sarah",
    image: "https://i.pravatar.cc/48?u=933372",
    balance: 20,
  },
  {
    id: 499476,
    name: "Anthony",
    image: "https://i.pravatar.cc/48?u=499476",
    balance: 0,
  },
];

function Button({ children, onClick }) {
  return (
    <button className='button' onClick={onClick}>
      {children}
    </button>
  );
}

export default function App() {
  const [showAddFriend, setShowAddFriend] = useState(false);
  const [friends, setFriends] = useState(initialFriends);
  const [selectedFriend, setSelectedFriend] = useState(null);

  function handleAddFriend(friend) {
    setFriends((friends) => [...friends, friend]);
    setShowAddFriend(false);
  }

  function handleSelection(friend) {
    setSelectedFriend((cur) => (cur?.id === friend.id ? null : friend));
    setShowAddFriend(false);
  }

  function handleShowAddFriend() {
    setShowAddFriend((show) => !show);
  }

  function handleSplitBill(value) {
    setFriends((friends) =>
      friends.map((friend) =>
        friend.id === selectedFriend.id
          ? { ...friend, balance: friend.balance + value }
          : friend
      )
    );
    setSelectedFriend(null);
  }

  return (
    <div className='app'>
      <header>
        <h1>Eat 'N Split</h1>
      </header>
      <div className='sidebar'>
        <FriendsList
          friends={friends}
          selectedFriend={selectedFriend}
          onSelection={handleSelection}
        />
        {showAddFriend && <FormAddFriend onAddFriend={handleAddFriend} />}
        <Button onClick={handleShowAddFriend}>
          {showAddFriend ? "Close" : "Add Friend"}
        </Button>
      </div>
      {selectedFriend && (
        <FormSplitBill
          key={selectedFriend.id}
          selectedFriend={selectedFriend}
          onSplitBill={handleSplitBill}
        />
      )}
    </div>
  );
}

function FriendsList({ friends, onSelection, selectedFriend }) {
  return (
    <ul className='freinds-list'>
      {friends.map((friend) => (
        <Friend
          friend={friend}
          key={friend.id}
          onSelection={onSelection}
          selectedFriend={selectedFriend}></Friend>
      ))}
    </ul>
  );
}

function Friend({ friend, onSelection, selectedFriend }) {
  const isSelected = selectedFriend?.id === friend.id;
  return (
    <li className={`friend${isSelected ? " selected" : ""}`}>
      <img src={friend.image} alt={friend.name} />
      <h3>{friend.name}</h3>
      {friend.balance < 0 && (
        <p className='red'>
          You owe {friend.name} ${Math.abs(friend.balance)}
        </p>
      )}
      {friend.balance > 0 && (
        <p className='green'>
          {friend.name} owes you ${friend.balance}
        </p>
      )}
      {friend.balance === 0 && <p>You and {friend.name} are even</p>}
      <Button onClick={() => onSelection(friend)}>
        {isSelected ? "Close" : "Select"}
      </Button>
    </li>
  );
}

function FormAddFriend({ onAddFriend }) {
  const [name, setName] = useState("");
  const [image, setImage] = useState("https://i.pravatar.cc/48?u=");

  function handleSubmit(e) {
    e.preventDefault();
    if (!name || !image) return;
    const id = crypto.randomUUID();
    const newFriend = {
      name,
      image: `${image}${id}`,
      balance: 0,
      id,
    };
    onAddFriend(newFriend);
    setName("");
    setImage("https://i.pravatar.cc/48?u=");
  }

  return (
    <form action='' onSubmit={handleSubmit} className='form-add-friend'>
      <label htmlFor=''>👩🏾‍🤝‍👩🏼 Friend name</label>
      <input
        type='text'
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <label htmlFor=''>🌄 Image URL</label>
      <input
        type='text'
        value={image}
        onChange={(e) => setImage(e.target.value)}
      />
      <Button>Add</Button>
    </form>
  );
}

function FormSplitBill({ selectedFriend, onSplitBill }) {
  const [bill, setBill] = useState("");
  const [paidByUser, setPaidbyUser] = useState("");
  const paidByFriend = bill ? bill - paidByUser : "";
  const [whosIsPaying, setWhoIsPaying] = useState("user");

  function handleSubmit(e) {
    e.preventDefault();
    if (!bill || !paidByUser) return;
    onSplitBill(whosIsPaying === "user" ? paidByFriend : -paidByUser);
  }

  return (
    <form className='form-split-bill' onSubmit={handleSubmit} action=''>
      <h2>Split bill with {selectedFriend.name}</h2>
      <label htmlFor=''>💰 Bill value</label>
      <input
        type='text'
        value={bill}
        onChange={(e) => setBill(Number(e.target.value))}
      />
      <label htmlFor=''>🙋Your expense</label>
      <input
        type='text'
        value={paidByUser}
        onChange={(e) =>
          setPaidbyUser(
            Number(e.target.value) > bill ? paidByUser : Number(e.target.value)
          )
        }
      />
      <label htmlFor=''>👩🏾‍🤝‍👩🏼 {selectedFriend.name}'s' expense:</label>
      <input type='text' disabled value={paidByFriend} />
      <label htmlFor=''>🤑 Who is paying the bill?</label>
      <select
        name=''
        id=''
        value={whosIsPaying}
        onChange={(e) => setWhoIsPaying(e.target.value)}>
        <option value='user'>You</option>
        <option value='friend'>{selectedFriend.name}</option>
      </select>
      <Button>Split Bill</Button>
    </form>
  );
}
