import React from 'react';

export default function AlgoSearchOne() {
  const [query, setQuery] = useState('');
  console.log(Users.filter((user) => user.name.toLowerCase().includes('ch')));
  return (
    <div>
      <input
        type="text"
        className="search"
        placeholder="Search..."
        onChange={(e) => setQuery(e.target.value)}
      />{' '}
      {/* Le tri se fait en fonction du nom */}
      {Users.filter((user) => user.name.toLowerCase().includes(query)).map(
        (user) => (
          <tr key={user._id}>
            <td>{user.name}</td>
            <td>{user.lastname}</td>
            <td>{user.email}</td>

            <td>
              <Button className="me-2" variant="">
                <Link>Update</Link>
              </Button>
              <Button>Delete</Button>
            </td>
          </tr>
        )
      )}
    </div>
  );
}

// Ici on fait la recherche seulement en fonction du nom
