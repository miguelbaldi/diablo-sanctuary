Boss prediction note's
======================

Boss spawn pattern
------------------

Which pattern is the right one?

`3+2+3+2+3+2+3+2+3+2+3+2+3+2+2`

or

`3+2+3+2`?

And, in which order?

- Ashava
- Wandering Death
- Avarice

or

- Wandering Death
- Avarice
- Ashava

Boss spawn timer pattern
------------------------

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

### Collected data

- (3) 05/10/2023, 09:02 Ashava
- (4) 05/10/2023, 14:55 Ashava
- (5) 05/10/2023, 20:20 Ashava
- (1) 06/10/2023, 02:14 WD
- (2) 06/10/2023, 07:39 WD
- (3) 06/10/2023, 13:33 Avarice

Pseudo-code trying to reverse engineer the patterns, both time and boss names:

```javascript
// Start date/time used for prediction calculation:
this.zero = DateTime.local(2023, 10, 5, 13, 55, 43, 0, { zone: 'UTC-4' }); // 05/10/2023, 14:55 Ashava
```

```javascript
this.bosses.push({ order: 4, offset: Duration.fromISO('PT5H53M30S'), boss: this.AS});
this.bosses.push({ order: 3, offset: Duration.fromISO('PT5H53M29S'), boss: this.AS});
this.bosses.push({ order: 2, offset: Duration.fromISO('PT5H25M13S'), boss: this.AS});
this.bosses.push({ order: 1, offset: Duration.fromISO('PT5H53M30S'), boss: this.AS});
this.bosses.push({ order: 5, offset: Duration.fromISO('PT5H25M13S'), boss: this.AS}); // 05/10 20:20h Ashava
```
