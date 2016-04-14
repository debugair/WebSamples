using System.Collections.Generic;
using Microsoft.AspNet.Mvc;

using Sample.Entities;
using Sample.Repositories;

namespace Sample.Controllers
{
    [Route("api/[controller]")]
    public class PersonController : Controller
    {
        [HttpGet]
        public IEnumerable<Person> Get()
        {
            return PersonRepository.ReadAll();
        }

        [HttpPost]
        public Person Post([FromBody]Person person)
        {
            return PersonRepository.Add(person);
        }

        [HttpPut]
        public Person Put([FromBody]Person person)
        {
            return PersonRepository.Change(person);
        }

        [HttpDelete]
        public int Delete([FromBody]int id)
        {
            PersonRepository.Remove(id);
            return id;
        }
    }
}
