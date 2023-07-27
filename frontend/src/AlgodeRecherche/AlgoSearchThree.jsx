import React from 'react';

export default function AlgoSearchTwo() {
  const [query, setQuery] = useState('');
  const keys = ['name', 'createdAt', 'updatedAt'];
  console.log(categorys[0]['name']);
  return (
    <div>
      <input
        type="text"
        className="search"
        placeholder="Search..."
        onChange={(e) => setQuery(e.target.value)}
      />{' '}
      {/* Le tri se fait en fonction des propriétés se trouvant dans le tableau "keys" */}
      {Users.filter((cat) =>
        keys.some((key) => cat[key].toLowerCase().includes(query))
      ).map((user) => (
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
      ))}
    </div>
  );
}

// Identique à la deuxième leàcon, mais ici on regroupe les propriétés dans un tableau (C'est plus professionnel et surtout facile à écrire)
