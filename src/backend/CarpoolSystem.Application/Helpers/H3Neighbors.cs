using H3;
using H3.Algorithms;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CarpoolSystem.Application.Helpers
{
    public static class H3Neighbors
    {
        public static IEnumerable<H3Index> GetDisk(
            H3Index origin,
            int k)
        {
            if (k < 0)
                throw new ArgumentOutOfRangeException(nameof(k));

            return origin.GetKRing(k).Select(cell => cell.Index);
        }
    }
}
