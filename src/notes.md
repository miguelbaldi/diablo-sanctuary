Boss prediction note's
======================

**Weekly Reset for World Bosses is on Thursday every week. Players can receive one Grand Cache every week from each of the three World Bosses.**

Boss spawn pattern
------------------

`3+2+3+2`

And, in which order?

- Ashava
- Wandering Death
- Avarice

or

- Wandering Death
- Avarice
- Ashava

Boss spawn timer pattern (Season 1)
-----------------------------------

The tried and true time pattern is the following:

- 5:53:30
- 5:25:13
- 5:53:29
- 5:53:30
- 5:25:13

**All time-based calculations must use `UTC-4 (EDT)` time zone.**

1. `Duration.fromISO('PT5H53M30S')`
2. `Duration.fromISO('PT5H25M13S')`
3. `Duration.fromISO('PT5H53M29S')`
4. `Duration.fromISO('PT5H53M30S')`
5. `Duration.fromISO('PT5H25M13S')`

### Season 1 Collected data

- (3) 05/10/2023, 09:02 Ashava
- (4) 05/10/2023, 14:55 Ashava
- (5) 05/10/2023, 20:20 Ashava (our starting point)
- (1) 06/10/2023, 02:14 WD
- (2) 06/10/2023, 07:39 WD
- (3) 06/10/2023, 13:33 Avarice
- (4) 06/10/2023, 21:26 Avarice
- (5) 07/10/2023, 02:51 Avarice
- (1) 07/10/2023, 08:45 Ashava?
- (2) 07/10/2023, 14:10 Ashava?

Pseudo-code trying to reverse engineer the patterns, both time and boss names:

```javascript
// Start date/time used for prediction calculation:
this.zero = DateTime.local(2023, 10, 5, 19, 20, 56, 0, { zone: 'UTC-4' }); // 06/10/2023, 02:14 WD
```

```javascript
this.bosses.push({ order: 4, offset: Duration.fromISO('PT5H53M30S'), boss: this.AS});
this.bosses.push({ order: 3, offset: Duration.fromISO('PT5H53M29S'), boss: this.AS});
this.bosses.push({ order: 2, offset: Duration.fromISO('PT5H25M13S'), boss: this.AS});
this.bosses.push({ order: 1, offset: Duration.fromISO('PT5H53M30S'), boss: this.AS});
this.bosses.push({ order: 5, offset: Duration.fromISO('PT5H25M13S'), boss: this.AS}); // 05/10 20:20h Ashava
```

Boss spawn timer pattern (Season 2)
-----------------------------------

The pattern was drastically simplified to be a simple offset:

- `Duration.fromISO('PT3H30M')`

There's no time restriction's.

**All time-based calculations must use `UTC-4 (EDT)` time zone.**

### Season 2 Collected data

- (3) 19/10/2023, 14:00 Wandering Death
- (3) 19/10/2023, 17:30 ?
