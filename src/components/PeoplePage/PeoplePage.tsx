import { useEffect, useMemo, useState } from 'react';
import { getPeople } from '../../api';
import { Person } from '../../types';
import { Loader } from '../Loader';
import { PeopleTable } from '../PeopleTable';

export const preparePeople = (people: Person[]) => {
  return people.map(person => {
    const mother = people.find(mom => mom.name === person.motherName);
    const father = people.find(dad => dad.name === person.fatherName);

    return {
      ...person,
      mother,
      father,
    };
  });
};

export const PeoplePage: React.FC = () => {
  const [people, setPeople] = useState<Person[] | []>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const fetchPeople = async () => {
    try {
      let data = await getPeople();

      data = preparePeople(data);
      setPeople(data);
      setIsLoading(false);
    } catch {
      setHasError(true);
    } finally {
      setIsLoading(false);
    }
  };

  const isPeopleExist = useMemo(() => {
    return people.length === 0 && !isLoading;
  }, [people]);

  useEffect(() => {
    fetchPeople();
  }, []);

  return (
    <>
      <h1 className="title">People Page</h1>

      {isLoading && <Loader />}

      {hasError && (
        <p
          data-cy="peopleLoadingError"
          className="has-text-danger"
        >
          Something went wrong
        </p>
      )}

      {people.length > 0 && (
        <PeopleTable
          people={people}
        />
      )}

      {isPeopleExist && (
        <p data-cy="noPeopleMessage">
          There are no people on the server
        </p>
      )}
    </>
  );
};
