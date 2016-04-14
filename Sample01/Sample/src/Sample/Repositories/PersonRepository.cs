using System.Collections.Generic;
using System.Linq;

using Sample.Entities;

namespace Sample.Repositories
{
    public static class PersonRepository
    {
        public static IList<Person> Persons { get; set; }

        static PersonRepository()
        {
            Persons = new List<Person>();
        }

        public static IEnumerable<Person> ReadAll()
        {
            return Persons;
        }

        public static Person Read(int? id)
        {
            return Persons.FirstOrDefault(p => p.Id == id);
        }

        public static Person Add(Person person)
        {
            person.Id = (Persons.Count > 0) ? Persons.Max(p => p.Id) + 1 : 1;
            Persons.Add(person);
            return person;
        }

        public static Person Change(Person person)
        {
            if (Persons.All(p => p.Id != person.Id)) return null;

            for (int pos = 0; pos < Persons.Count; pos++)
            {
                if (Persons[pos].Id != person.Id) continue;
                Persons.RemoveAt(pos);
                Persons.Add(person);
                break;
            }
            return person;
        }

        public static void Remove(int id)
        {
            if (Persons.All(p => p.Id != id)) return;

            for (int pos = 0; pos < Persons.Count; pos++)
            {
                if (Persons[pos].Id != id) continue;
                Persons.RemoveAt(pos);
                break;
            }
        }
    }
}